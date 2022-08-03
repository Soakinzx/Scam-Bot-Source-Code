const Discord = require("discord.js")
const axios = require('axios');

module.exports = {
  name: "instagrampost",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "see an instagram post",
  usage: ["$instagrampost <post url>"],
  run: async (client, message, args) => {
    if (!args[0]) return message.reply({
      content: "Argument Missing: `url`"
    })
    if (!args.join(" ").startsWith("https://www.instagram.com")) return message.reply({
      content: "Argument Invalid: `url: must be an instagram post url`"
    })
    let url = args.join(" ")
    const axios = require("axios");
    const cheerio = require("cheerio");

    async function getPost(url) {
      if (url.startsWith("https://www.instagram.com/reel/")) return {
        error: "Reels Not Allowed"
      }
      // calls axios to go to the page and stores the result in the html variable
      try {
        await axios.get(url)
      } catch (err) {
        return {
          error: "Invalid URL Provided"
        }
      }
      const html = await axios.get(url);

      const $ = cheerio.load(html.data);
      let format = (html.data.includes("og:video")) ? "og:video" : "og:image"
      const postString = $("meta[property='" + format + "']").attr("content");
      if (!postString) return {
        error: "Invalid URL Provided"
      }
      const postDesc = $("meta[property='og:description']").attr("content") || "Not Found"
      const postTitle = $("meta[property='og:title']").attr("content") || "Not Found"

      return {
        url: postString,
        description: postDesc,
        title: postTitle
      }
    };
    await getPost(url).then(data => {
      if (data["error"]) {
        return message.reply({
          content: `${data["error"]}`
        })
      }
      return message.channel.send({
        content: `**Title:** ${data.title}\n**Description:** ${data.description}`,
        files: [data.url]
      })
    })

  },
}
/*
axios.post('https://custom-apis.soakinzx.repl.co/apis/get-instagram-post', {
      url: url,
    }).then(html => {
      let data = html.data
      if (data["error"]) {
        return message.reply({
          content: `${data["error"]}`
        })
      }
      return message.channel.send({
        content: `**Title:** ${data.title}\n**Description:** ${data.description}`,
        files: [data.url]
      })
    })
  */
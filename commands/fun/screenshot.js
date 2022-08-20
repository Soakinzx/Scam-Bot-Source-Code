let functions = require("../../functions.js")
const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
const request = require("request")

module.exports = {
  name: "screenshot",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$screenshot <url>"],
  req_perms: ["SEND_MESSAGES"],
  description: "screenshot a website",
  run: async (client, message, args) => {
    
    if(!args[0]) return message.reply({content: "Argument Missing: `url`"})
    let url = args.join(" ")
    if(!functions.isValidUrl(url)) return message.reply({content: "Argument Invalid: `url`"})
    try {

      const site = /^(https?:\/\/)/i.test(url) ? url : `http://${url}`
      

      let dom = (new URL(url));
      dom = dom.hostname.replace("www.", "")
      message.reply({
        embeds: [new MessageEmbed()
          .addField(`Screenshotted Website`, `[${dom}](${site})`)
          .setImage(`https://image.thum.io/get/width/1950/crop/700/noanimate/${site}`)
        ]
      })
    } catch (err) {
      message.reply({
        content: `${err}`
      })
    }
  }
}
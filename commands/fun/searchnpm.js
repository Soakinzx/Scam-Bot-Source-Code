const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "searchnpm",
  aliases: ["npmsearch"],
  category: "fun",
  permission: [],
  usage: ["$searchnpm"],
  req_perms: ["SEND_MESSAGES"],
  description: "search for an npm package",
  run: async (client, message, args) => {


    request(`https://api.popcat.xyz/npm?q=${args.join("-")}`, async (err, res, body) => {
      if(err) return;
      let json = JSON.parse(body)
      let embed = {
          title: "NPM Search"
      }
      if(json.error) {
          embed.description = json.error
      } else {
          embed.description = json.description
          embed.fields = [
              {name: "Info", value: `**Version:** \`${json.version}\`\n**Downloads:** \`${json.downloads_this_year}\`\n**Maintainers:** \`${json.maintainers}\`\n**Last Published:** \`${json.last_published}\`\n**Repository** - ${json.repository}`, inline: true},
              {name: "Author Info", value: `**Name:** \`${json.author}\`\n**Email:** \`${json.author_email}\``, inline: true}
          ]
      }
      return message.channel.send({embeds: [embed]})
    })

  }
}

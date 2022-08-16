const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "steam",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$steam <steam app name>"],
  req_perms: ["SEND_MESSAGES"],
  description: "get info on a steam app",
  run: async (client, message, args) => {
    if(!args.length) return message.reply({
      content: "Argument Missing: `steam app name`"
    })

    request(`https://api.popcat.xyz/steam?q=${args.join("20%")}`, async (err, res, body) => {
      if(err) return;
      let json = JSON.parse(body)
      
      let embed = {}
      console.log(json)
      if(json.error) {
        embed.title = "Error"
        embed.description = json.error
      } else {
        embed.color = "DARK_BUT_NOT_BLACK"
        embed.title = json.name
        if(json.website !== "None"){
            embed.url = json.website
        }
        if(json.thumbnail !== "None"){
            embed.image = {url:json.thumbnail}
        }
        if(json.banner !== "None"){
            embed.thumbnail = {url:json.banner}
        }
        embed.fields = [
        {
            name: "App Info",
            value: `**Type:** \`${json.type}\`\n**Developers:** \`${(json.developers)?json.developers.join(", "):"None"}\`\n**Publishers:** \`${(json.publishers)?json.publishers.join(", "):"None"}\`\n**Price:** \`${json.price}\``,
            inline: true
        }]
      }
      message.channel.send({
        embeds: [embed]
      })
    })

  }
}

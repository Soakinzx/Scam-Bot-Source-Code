const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "showerthought",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$showerthought"],
  req_perms: ["SEND_MESSAGES"],
  description: "get a shower thought",
  run: async (client, message, args) => {


    request("https://api.popcat.xyz/showerthoughts", async (err, res, body) => {
      if(err) return;
      let json = JSON.parse(body)
      let text = json.result.toLowerCase()
      let embed = new discord.MessageEmbed
      embed.setColor("DARK_BUT_NOT_BLACK")
      embed.setDescription(text)
      message.channel.send({
        embeds: [embed]
      })
    })

  }
}

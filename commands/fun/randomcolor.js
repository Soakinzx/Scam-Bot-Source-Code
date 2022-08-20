const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "randomcolor",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$randomcolor"],
  req_perms: ["SEND_MESSAGES"],
  description: "get a random color",
  run: async (client, message, args) => {


    request("https://api.popcat.xyz/randomcolor", async (err, res, body) => {
      if(err) return;
      let json = JSON.parse(body)
      let embed = new discord.MessageEmbed
      embed.setColor(json.hex)
      embed.setTitle(`${json.name} | ${json.hex}`)
      embed.setImage(json.image)
      message.channel.send({
        embeds: [embed]
      })
    })

  }
}

const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "randomfact",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$randomfact"],
  req_perms: ["SEND_MESSAGES"],
  description: "get a random fact",
  run: async (client, message, args) => {


    request("https://api.popcat.xyz/fact", async (err, res, body) => {
      if(err) return;
      let json = JSON.parse(body)
      let text = json.fact.toLowerCase()
      let letters = {
        "a": "𝐚",
        "b": "𝐛",
        "c": "𝐜",
        "d": "𝐝",
        "e": "𝐞",
        "f": "𝐟",
        "g": "𝐠",
        "h": "𝐡",
        "i": "𝐢",
        "j": "𝐣",
        "k": "𝐤",
        "l": "𝐥",
        "m": "𝐦",
        "n": "𝐧",
        "o": "𝐨",
        "p": "𝐩",
        "q": "𝐪",
        "r": "𝐫",
        "s": "𝐬",
        "t": "𝐭",
        "u": "𝐮",
        "v": "𝐯",
        "w": "𝐰",
        "x": "𝐱",
        "y": "𝐲",
        "z": "𝐳",
      }
      

      let embed = new discord.MessageEmbed
      embed.setColor("DARK_BUT_NOT_BLACK")
      embed.setDescription(text)
      message.channel.send({
        embeds: [embed]
      })
    })

  }
}

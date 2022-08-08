
const discord = require("discord.js")
let functions = require("../../functions.js")
module.exports = {
  name: "iphonealert",
  aliases: [],
  category: "image",
  permission: [],
  usage: ["$iphonealert <text>"],
  req_perms: ["SEND_MESSAGES"],
  description: "an iphone alert message",
  run: async (client, message, args) => {
    if(!args.length) return message.reply({content: "Argument Missing: `text`"})
    let url = `https://api.popcat.xyz/alert?text=${args.join("%20")}`
    let embed = {
      title: "Iphone Alert",
      image: {
        url: url
      }
    }
    message.channel.send({embeds:[embed]})
    
  }
}
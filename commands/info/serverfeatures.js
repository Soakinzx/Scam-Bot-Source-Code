function convert(date) {
  let ms = (Date.now() - date)
  let secs = Math.floor(ms / 1000)
  let mins = Math.floor(secs / 60)
  let hours = Math.floor(mins / 60)
  let days = Math.floor(hours / 24)
  secs %= 60;
  mins %= 60;
  hours %= 24;
  return `${days}d ${hours}h ${mins}m ${secs}s`
}
function format(string) {
  let parts = string.replaceAll("_", " ").split(" ")
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase()
  }
  string = parts.join(" ")
  return string
}
const {
  MessageEmbed
} = require("discord.js");
let discord = require("discord.js")
let functions = require("../../functions.js")
module.exports = {
  name: "serverfeatures",
  aliases: ["sf"],
  category: "info",
  permission: [],
  req_perms: [],
  usage: ["$serverfeatures"],
  description: "fetches server features",
  run: async (client, message, args, config) => {
    let features = message.guild.features.map(f => `\`${format(f)}\``)
    if(features.length == 0) return message.reply({content: "Server Has No Features"})
    let embed = {
        title: "Server Features",
        description: features.join(", ")
    }
    return message.channel.send({embeds: [embed]})
  },
}

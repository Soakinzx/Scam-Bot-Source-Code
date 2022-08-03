const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
let discord = require("discord.js")
const client = require("../../index.js");


function convert(date) {
  let ms = date
  let secs = Math.floor(ms / 1000)
  let mins = Math.floor(secs / 60)
  let hours = Math.floor(mins / 60)
  let days = Math.floor(hours / 24)
  secs %= 60;
  mins %= 60;
  hours %= 24;
  days %= 24
  return `${days}d ${hours}h ${mins}m ${secs}s`
}

function format(string) {
  let parts = string.split(" ")
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase()
  }
  string = parts.join(" ")
  return string
}
let functions = require("../../functions.js")
module.exports = {
  name: "uptime",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$uptime"],
  category: "info",
  description: "my uptime",
  run: async (client, message, args) => {
    let embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setDescription(`**Uptime** ${convert(client.uptime)}`)
      .setFooter(`${client.user.id}`, client.user.displayAvatarURL({dynamic: true}))
      .setTimestamp()

    return message.channel.send({embeds: [embed]})
  },
}
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
  name: "botinfo",
  aliases: ["bi", "about"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$botinfo"],
  category: "info",
  description: "info about me",
  run: async (client, message, args) => {
    let dev = "765201883157495860"
    let embed = new MessageEmbed()
      .setTitle(`${client.user.username} info`)
      .setColor("DARK_BUT_NOT_BLACK")
      .setDescription(`**Watching** \`${client.guilds.cache.size}\` Servers\n**Watching** \`${client.users.cache.size}\` Users\n**Uptime** ${convert(client.uptime)}\n**Server** - [link](${client.server_link})\n**Invite** - [link](${client.invite_link})\n**Libary** discord.js\n`)
      .addField(`Owners`, functions.text_block(`${client.owners.slice(1, client.owners.length).map(id => {
        if(id == dev){
          return `${client.users.cache.get(id).tag}(devoloper)`
        } else {
          return client.users.cache.get(id).tag
        }
      }).join(", ")}`), true)
      .addField(`Created`, functions.text_block(`${client.user.createdAt.toLocaleDateString("en-US")}`), true)
      .addField(`Commands`, functions.text_block(`${client.commands.size}`), true)
      .setFooter(`${client.user.id}`, client.user.displayAvatarURL({dynamic: true}))
      .setAuthor(`${client.user.tag}`, client.user.displayAvatarURL({dynamic: true}))
      .setTimestamp()

    return message.channel.send({embeds: [embed]})
  },
}
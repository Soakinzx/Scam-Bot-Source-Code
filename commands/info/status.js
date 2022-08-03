const {
  MessageEmbed,
  GuildMember,
  Client
} = require("discord.js");
let discord = require("discord.js")
const client = require("../../index.js");
let moment = require("moment")

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
  
  let parts = string.split(" ")
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase()
  }
  string = parts.join(" ")
  return string
}

module.exports = {
  name: "status",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$status <optional: user>"],
  category: "info",
  description: "fetches status of a user",
  run: async (client, message, args) => {
    let u = "usernotfound++++scambotcode"
    if(args[0]){
      u = args.join(" ")
    }
    const member = message.mentions.members.first() || message.guild.members.cache.get(u) || message.guild.members.cache.find(m => m.user.username.startsWith(u.toLowerCase())) || message.guild.members.cache.find(m => m.user.tag.startsWith(u.toLowerCase())) || message.member;
    
    let status = member.presence?.status || "offline"
    
    let devices = (member.presence?.clientStatus !== null && typeof member.presence?.clientStatus !== "undefined") ? `**Devices(${Object.keys(member.presence?.clientStatus).length})** ${Object.keys(member.presence?.clientStatus).map(key => `\`${key}\``).join(", ")}` : "**Devices(0)**"
    
    let str = `${status}\n${devices}`
    let presence = member.presence.activities

    if(presence){
      presence.map(p => {
        if(p.id == "custom"){
          str+=`\n**${p.name}** ${(p.state) ? p.state : "Not Set"} ${moment(p.createdTimestamp).fromNow()}`
        } else {
          str+=`\n**${p.type}** ${(p.name) ? p.name : "Nothing"} ${p.platform || "Platform Not Found"} ${moment(p.createdTimestamp).fromNow()}`
        }
      })
    }
    message.channel.send({embeds: [{title: `${member.user.tag}'s status`,description: str}]})
  },
}
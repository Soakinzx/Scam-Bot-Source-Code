const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
module.exports = {
  name: "kick",
  aliases: [],
  permission: ["KICK_MEMBERS"],
  category: "moderation",
  req_perms: ["KICK_MEMBERS", "SEND_MESSAGES"],
  usage: ["$kick <user>"],
  description: "kick a user",
  run: async (client, message, args) => {
    if(!args.join(" ")) return message.reply({content: "Argument missing: `@member`"})
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username.toLowerCase() == args.join(" ").toLowerCase()) || message.guild.members.cache.find(member => member.user.tag.toLowerCase() == args.join(" ").toLowerCase())
    if(!member) return message.reply({content: "Argument invalid : `@member`"})
    if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 && message.guild.ownerId !== message.member.id) return message.reply({content: `${member} has higher authority than you`})
    
    
    try{
      member.kick().then(() => {
        return message.reply({content: `Kicked ${member.user.tag}`})
      }).catch(err => {
        return message.reply({content: `${err}`})
      })
    } catch(err){
      return message.reply({content: `${err}`})
    }

  },
}
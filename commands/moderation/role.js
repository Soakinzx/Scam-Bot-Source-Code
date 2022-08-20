const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
module.exports = {
  name: "role",
  aliases: [],
  permission: ["MANAGE_ROLES"],
  category: "moderation",
  req_perms: ["MANAGE_ROLES", "SEND_MESSAGES"],
  usage: ["$role <user> <role>"],
  description: "add/remove a role from a user",
  run: async (client, message, args) => {
    if (!args.join(" ")) return message.reply({
      content: "Arguments missing: `@member, @role`"
    })
    if (!args[0]) return message.reply({
      content: "Argument missing: `@member`"
    })
    if (!args[1]) return message.reply({
      content: "Argument missing: `@role`"
    })
    
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username.toLowerCase().startsWith(args[0].toLowerCase())) || message.guild.members.cache.find(member => member.user.tag.toLowerCase().startsWith(args[0].toLowerCase()))
    
    args = args.splice(1)
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    
    if (!member) return message.reply({
      content: "Argument invalid : `@member`"
    })
    if (!role) return message.reply({
      content: "Argument invalid : `@role`"
    })
    if(message.member.roles.highest.comparePositionTo(role) <= 0 && message.guild.ownerId !== message.member.id) return message.reply({content: `\`${role.name}\` role has higher/equal authority than your current highest role`})
    
    if(message.guild.me.roles.highest.comparePositionTo(role) < 0) return message.reply({content: `\`${role.name}\` role has higher authority than my current highest role`})
    try {
      
      if(member.roles.cache.get(role.id)) {
        member.roles.remove(role).then(() => {
          return message.reply({content: `Removed \`${role.name}\` from ${member}`})
        }).catch(err => {
          return message.reply({content: `${err}`})
        })
      } else {
        member.roles.add(role).then(() => {
          return message.reply({content: `Added \`${role.name}\` to ${member}`})
        }).catch(err => {
          return message.reply({content: `${err}`})
        })
      }
    } catch (err) {
      
      return message.reply({
        content: `${err}`
      })
    }

  },
}
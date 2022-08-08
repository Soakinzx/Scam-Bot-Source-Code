const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
module.exports = {
  name: "ban",
  aliases: [],
  permission: ["BAN_MEMBERS"],
  category: "moderation",
  req_perms: ["BAN_MEMBERS", "SEND_MESSAGES"],
  usage: ["$ban <user>"],
  description: "ban a user",
  run: async (client, message, args) => {
    if (!args.join(" ")) return message.reply({
      content: "Argument Missing: `@member: member or id`"
    })
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username.toLowerCase() == args.join(" ").toLowerCase()) || message.guild.members.cache.find(member => member.user.tag.toLowerCase() == args.join(" ").toLowerCase())

    if (!member) {
      try {
        message.guild.bans.create(args.join(" "), {
          reason: `banned by ${message.member}`
        }).then((user) => {
          return message.reply({
            content: `Banned ${member.user.tag} `
          })
        }).catch(err => {
          return message.reply({
            content: "Argument Invalid: `@member: member or id`"
          })
        })
      } catch (err) {
        return message.reply({
          content: "Argument Invalid: `@member: member or id`"
        })
      }
      return;
    }
    if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 && message.guild.ownerId !== message.member.id) return message.reply({
      content: `${member} has higher authority/equal than you`
    })
    if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({
      content: `${member} has higher/equal authority than me`
    })
    try {
      message.guild.bans.create(member, {
        reason: `banned by ${message.member}`
      }).then((user) => {
        return message.reply({
          content: `Banned ${member.user.tag} `
        })
      }).catch(err => {
        return message.reply({
          content: `${err}`
        })
      })
    } catch (err) {
      return message.reply({
        content: `${err}`
      })
    }

  },
}

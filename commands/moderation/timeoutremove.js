const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
module.exports = {
  name: "timeoutremove",
  aliases: ["tr"],
  permission: ["MODERATE_MEMBERS"],
  req_perms: ["MODERATE_MEMBERS", "SEND_MESSAGES"],
  category: "moderation",
  usage: ["$timeoutremove <user>"],
  description: "remove timeout from a user",
  run: async (client, message, args) => {

    let u = "usernotfound+++scambotcode"
    if (!args[0]) {
      u = args.join(" ")
    }
    const member = message.mentions.members.first() || message.guild.members.cache.get(u) || message.guild.members.cache.find(m => m.user.username.startsWith(u.toLowerCase())) || message.guild.members.cache.find(m => m.user.tag.startsWith(u.toLowerCase())) || message.member;
    if (!member) return message.reply({
      content: "Argument missing: `@member`"
    })
    if (member == message.member) return message.reply({
      content: "You cant untime your self out"
    })
    if (member.communicationDisabledUntilTimestamp === null) return message.reply({
      content: `${member} is not timedout`
    })
    if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) <= 0 || message.guild.ownerId === member.id) return message.reply({
      content: `${member} has higher/equal authority than me`
    })

    if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 || message.guild.ownerId === member.id) return message.reply({
      content: `${member} has higher/equal authority than you`
    })
    member.timeout(0, `untimedout by ${message.member.user.tag}`).then(() => {
        message.channel.send({
          content: `Removed timeout from ${member}`
        })
      })
      .catch(console.error);

  },
}
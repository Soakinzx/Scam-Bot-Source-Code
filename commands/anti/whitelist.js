const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "whitelist",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$whitelist <user>"],
  description: "whitelist a user from antinuke, antilink, antialt, antibot, antialt",
  run: async (client, message, args) => {

    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id

    if (!args.join(" ")) return message.reply({
      content: "Argument Missing: `@member`"
    })

    let member = message.mentions.members.first() || message.guild.members.cache.get(args.join(" ")) || message.guild.members.cache.find(m => m.user.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.user.tag.toLowerCase().startsWith(args.join(" ").toLowerCase()))

    if (!member) return message.reply({
      content: "Argument Invalid: `@member`"
    })
    if(member == message.member) return message.reply({
      content: "Argument Invalid: `@member: cannot be yourself`"
    })


    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data) {
      
      gs.whitelisted = [user.id]
      data = new gdb(gs)
      data.save()

      return message.reply({
        content: `Whitelisted \`${member.user.tag}\` protecting them from ${client.user.username} antinuke, antilink, antialt, antibot, antialt`
      })
    } else {
      
      if (data.whitelisted.includes(member.id)) {
        data.whitelisted.splice(data.whitelisted.indexOf(member.id), 1)
        data.save()
        return message.reply({
          content: `Unwhitelisted \`${member.user.tag}\` unprotecting them from ${client.user.username} antinuke, antilink, antialt, antibot, antialt, etc.`
        })
      } else {
        data.whitelisted.push(member.id)
        data.save()
        return message.reply({
          content: `Whitelisted \`${member.user.tag}\` protecting them from ${client.user.username} antinuke, antilink, antialt, antibot, antialt, etc.`
        })
      }
    }
  },
}
const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "trust",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "OWNER"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$trust <user>"],
  description: "trust a user to manage antinuke, antilink, antialt, antibot, antialt, etc.",
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
      if (message.member.id !== message.guild.ownerId) return message.reply({
        content: `you are not the owner of this server`
      })
      gs.trusted = [member.id]
      data = new gdb(gs)
      data.save()

      return message.reply({
        content: `trusted \`${member.user.tag}\` allowing them to manage ${client.user.username} antinuke, antilink, antialt, antibot, antialt, etc.`
      })
    } else {
      if (data.trusted.includes(member.id)) {
        data.trusted.splice(data.trusted.indexOf(member.id), 1)
        data.save()
        return message.reply({
          content: `untrusted \`${member.user.tag}\` from allowing them to manage ${client.user.username} antinuke, antilink, antialt, antibot, antialt, etc.`
        })
      } else {
        
        data.trusted.push(member.id)
        data.save()
        return message.reply({
          content: `trusted \`${member.user.tag}\` allowing them to manage ${client.user.username} antinuke, antilink, antialt, antibot, antialt, etc.`
        })
      }
    }
  },
}
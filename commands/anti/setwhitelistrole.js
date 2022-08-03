const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setwhitelistrole",
  aliases: ["swr"],
  category: "anti",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$setwhitelistrole <role>"],
  description: "set a role as a whitelisted role",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if (!args[0]) return message.reply({
      content: "Must specify an argument: `@role`"
    })
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if(!role) return message.reply({content: "Must specify a valid argument: `@role`"})
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      let role = message.guild.roles.cache.get(data.trustrole)
      if(!role){
        role = "Not Set"
      } else {
        role = role.name
      }
      if (message.member.id !== message.guild.ownerId && !message.member.roles.cache.has(data.trustrole) && !data.trusted.includes(message.author.id)) return message.reply({
          content: `You do not have the required trust role \`${role}\` and You are not on the trusted list and You are not the owner of this server`
      })
      gs.whitelistrole = role.id
      data = new gdb(gs)
      data.save()
      return message.reply({content: `Set Whitelist Role \`${role.name}\``})
    } else {
      let role = message.guild.roles.cache.get(data.trustrole)
      if(!role){
        role = "Not Set"
      } else {
        role = role.name
      }
      if (message.member.id !== message.guild.ownerId && !message.member.roles.cache.has(data.trustrole) && !data.trusted.includes(message.author.id)) return message.reply({
          content: `You do not have the required trust role \`${role}\` and You are not on the trusted list and You are not the owner of this server`
      })
      
      data.whitelistrole = role.id
      data.save()
      return message.reply({content: `Set Whitelist Role \`${role.name}\``})
    }
  },
}

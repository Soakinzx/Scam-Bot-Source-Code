const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setquarantinerole",
  aliases: ["sqr"],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$setquarantinerole <role>"],
  description: "set the servers quaratine role, automatically sets it up, no need to do it manually",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args[0]) return message.reply({
      content: "Must specify an argument: `@role or 'reset'`"
    })

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(role => role.name.toLowerCase()
      .startsWith(args.join(" ")
        .toLowerCase()))
    if(!role && args[0].toLowerCase() !== "reset") return message.reply({
      content: "Must specify a valid argument: `@role or 'reset'`"
    })
    if(role && message.guild.me.roles.highest.comparePositionTo(role) < 0) return message.reply({
      content: `\`${role.name}\` role has higher authority/position than my current highest role`
    })
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data) {
      if(role && args[0].toLowerCase() !== "reset") {
        gs.quarantinerole = role.id
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Set Quarantine Role \`${role.name}\``
        })
      } else if(args[0].toLowerCase() == "reset") {
        gs.quarantinerole = null
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Quarantine Role Reset`
        })
      }
    } else {

      if(role && args[0].toLowerCase() !== "reset") {
        data.quarantinerole = role.id
        data.save()
        return message.reply({
          content: `Set Quarantine Role \`${role.name}\``
        })
      } else if(args[0].toLowerCase() == "reset") {
        data.quarantinerole = null
        data.save()
        return message.reply({
          content: `Quarantine Role Reset`
        })
      }
    }
    

  },
}
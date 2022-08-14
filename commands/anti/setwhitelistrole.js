const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setwhitelistrole",
  aliases: ["swr"],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$setwhitelistrole <role>"],
  description: "set a role as a whitelisted role",
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
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data) {
      
      if(role && args[0].toLowerCase() !== "reset") {
        gs.whitelistrole = role.id
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Set Whitelist Role \`${role.name}\``
        })
      } else if(args[0].toLowerCase() == "reset") {
        gs.whitelistrole = null
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Whitelist Role Reset`
        })
      }
    } else {
   
      if(role && args[0].toLowerCase() !== "reset") {
        data.whitelistrole = role.id
        data.save()
        return message.reply({
          content: `Set Whitelist Role \`${role.name}\``
        })
      } else if(args[0].toLowerCase() == "reset") {
        data.whitelistrole = null
        data.save()
        return message.reply({
          content: `Whitelist Role Reset`
        })
      }
    }
  },
}
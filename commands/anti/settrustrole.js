const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "settrustrole",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "OWNER"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$settrustrole <role>"],
  description: "set a role as a trusted role, be careful, whoever has this trusted role can disable anti commands and tamper with them",
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
        gs.trustrole = role.id
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Set Trust Role \`${role.name}\``
        })
      } else if(args[0].toLowerCase() == "reset") {
        gs.trustrole = null
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Trust Role Reset`
        })
      }
    } else {

      if(role && args[0].toLowerCase() !== "reset") {
        data.trustrole = role.id
        data.save()
        return message.reply({
          content: `Set Trust Role \`${role.name}\``
        })
      } else if(args[0].toLowerCase() == "reset") {
        data.trustrole = null
        data.save()
        return message.reply({
          content: `Trust Role Reset`
        })
      }
    }
  },
}

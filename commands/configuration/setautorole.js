const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setautorole",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$setautorole <true/false>"],
  description: "enable autorole",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if (!args[0]) return message.reply({
      content: "Must specify an argument: `true/false`"
    })
    let argument1 = args[0].toLowerCase()
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data) {
      if (argument1 == "true") {
        gs.auto_role = true
      } else if (argument1 == "false") {
        if (gs.auto_role == false) return message.reply({
          content: "Auto Role is already disabled"
        })
        gs.auto_role = false
      } else {
        return message.reply({
          content: "Must specify a valid argument: `true/false`"
        })
      }
      data = new gdb(gs)
      data.save()
      return message.reply({
        content: `Auto Role set to \`${data.auto_role}\``
      })
    } else {
      if (argument1 == "true") {
        if (data.auto_role == true) return message.reply({
          content: "Auto Role is already enabled"
        })
        data.auto_role = true
        data.save()
        return message.reply({
          content: `Auto Role set to \`${data.auto_role}\``
        })
      } else if (argument1 == "false") {
        if (data.auto_role == false) return message.reply({
          content: "Auto Role is already disabled"
        })
        data.auto_role = false
        data.save()
        return message.reply({
          content: `Auto Role set to \`${data.auto_role}\``
        })
      } else {
        return message.reply({
          content: "Must specify a valid argument: `true/false`"
        })
      }
    }

  },
}
/*
const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setsaveroles",
  aliases: [],
  category: "configuration",
  permission: [],
  usage: ["$setsaveroles"],
  description: "fetches info about the server",
  run:async (client, message, args) => {
    
},
}





  */
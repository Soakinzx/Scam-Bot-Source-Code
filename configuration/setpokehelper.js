const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setpokehelper",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$setpokehelper <true/false>"],
  description: "enable pokehelper to help catch pokemon sent by poketwo",
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
        gs.pokehelper = true
      } else if (argument1 == "false") {
        if (gs.pokehelper == false) return message.reply({
          content: "Pokehelper is already disabled"
        })
        gs.pokehelper = false
      } else {
        return message.reply({
          content: "Must specify a valid argument: `true/false`"
        })
      }
      data = new gdb(gs)
      data.save()
      return message.reply({
          content: `Pokehelper set to \`${data.pokehelper}\``
        })
    } else {
      if (argument1 == "true") {
        if (data.pokehelper == true) return message.reply({
          content: "Pokehelper is already enabled"
        })
        data.pokehelper = true
        data.save()
        return message.reply({
          content: `Pokehelper set to \`${data.pokehelper}\``
        })
      } else if (argument1 == "false") {
        if (data.pokehelper == false) return message.reply({
          content: "Pokehelper is already disabled"
        })
        data.pokehelper = false
        data.save()
        return message.reply({
          content: `Pokehelper set to \`${data.pokehelper}\``
        })
      } else {
        return message.reply({
          content: "Must specify a valid argument: `true/false`"
        })
      }
    }

  },
}
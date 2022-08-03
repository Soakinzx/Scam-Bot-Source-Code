const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setprefix",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$setprefix <prefix>"],
  description: "set guild prefix",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if (!args) return message.reply({
      content: "Must specify an argument: `prefix ex. $`"
    })
    let argument = args.join(" ")
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data) {
      gs.prefix = argument.toLowerCase()
      data = new gdb(gs)
      data.save()
      return message.reply({
        content: `Set ${message.guild.name} server prefix: \`${data.prefix}\``
      })
    } else {
      data.prefix = argument.toLowerCase()
      data.save()
      return message.reply({
        content: `Set ${message.guild.name} server prefix: \`${data.prefix}\``
      })
    }

  },
}
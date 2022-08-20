const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setjtc",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
  usage: ["$setjtc <voice channel>"],
  description: "set join to create voice channel",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args.length) return message.reply({
      content: "Must specify an argument: `#VoiceChannel or 'reset'`"
    })
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name.toLowerCase()
      .startsWith(args.join(" ")
        .toLowerCase()))
    if(!channel && args[0].toLowerCase() !== "reset") return message.reply({
      content: `Voice Channel Not Found`
    })
    if(channel && channel.type !== "GUILD_VOICE") return message.reply({
      content: "Channel Found But is Not a Voice Channel"
    })
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data) {
      if(!channel && args[0].toLowerCase() == "reset") {
        gs.jtc = null
        data = new gdb(gs)

        data.save()
        return message.reply({
          content: `Join To Create Channel Reset`
        })
      } else if(channel) {
        gs.jtc = channel.id
        data = new gdb(gs)

        data.save()
        return message.reply({
          content: `Set Join To Create Channel to ${channel}`
        })
      }
    } else {
      if(channel && args[0].toLowerCase() !== "reset") {
        data.jtc = channel.id
        data.save()

        return message.reply({
          content: `Set Join To Create Channel to ${channel}`
        })
      } else if(!channel && args[0].toLowerCase() == "reset") {
        data.jtc = null
        data.save()

        return message.reply({
          content: `Join To Create Channel Reset`
        })
      }
    }

  },
}
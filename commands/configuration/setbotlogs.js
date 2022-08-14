const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setbotlogs",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$setbotlogs <text channel>"],
  description: "set bot logs channel",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args.length) return message.reply({
      content: "Must specify an argument: `#TextChannel or 'reset'`"
    })
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name.toLowerCase()
      .startsWith(args.join(" ")
        .toLowerCase()))
    if(!channel && args[0].toLowerCase() !== "reset") return message.reply({
      content: `Text Channel Not Found`
    })
    if(channel && channel.type !== "GUILD_TEXT") return message.reply({
      content: "Channel Found But is Not a Text Channel"
    })
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data) {
      if(!channel && args[0].toLowerCase() == "reset") {
        gs.bot_logs_channel = null
        data = new gdb(gs)

        data.save()
        return message.reply({
          content: `Bot Logs Channel Reset`
        })
      } else if(channel) {
        gs.bot_logs_channel = channel.id
        data = new gdb(gs)

        data.save()
        return message.reply({
          content: `Set Bot Logs Channel to ${channel}`
        })
      }
    } else {
      if(channel && args[0].toLowerCase() !== "reset") {
        data.bot_logs_channel = channel.id
        data.save()

        return message.reply({
          content: `Set Bot Logs Channel to ${channel}`
        })
      } else if(!channel && args[0].toLowerCase() == "reset") {
        data.bot_logs_channel = null
        data.save()

        return message.reply({
          content: `Bot Logs Channel Reset`
        })
      }
    }

  },
}
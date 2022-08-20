const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "unhide",
  aliases: [],
  category: "moderation",
  permission: ["MANAGE_CHANNELS"],
  req_perms: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
  usage: ["$unhide <optional: channel>"],
  description: "unhides a channel",
  run: async (client, message, args) => {
    
    if(!args[0]){
      args[0] = "channelnotfound++++scambot"
    }
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.channel

    channel.permissionOverwrites.edit(message.guild.roles.everyone,{ 'VIEW_CHANNEL': true }).catch(err => {
        message.reply({content: `${err}`})
      })
    return message.reply({content: `\`${channel.name}\` is now unhidden :man_gesturing_ok:`})
    
  },
}
const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "unlock",
  aliases: [],
  category: "moderation",
  permission: ["MANAGE_CHANNELS"],
  req_perms: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
  usage: ["$unlock <optional: channel>"],
  description: "lock a channel",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args[0]){
      args[0] = "channelnotfound++++scambot"
    }
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.channel

    
    if(channel.type == "GUILD_TEXT"){
      channel.permissionOverwrites.edit(message.guild.roles.everyone,{ 'SEND_MESSAGES': true }).catch(err => {
        message.reply({content: `${err}`})
      })
    } else if(channel.type == "GUILD_VOICE"){
      channel.permissionOverwrites.edit(message.guild.roles.everyone,{ 'CONNECT': true }).catch(err => {
        message.reply({content: `${err}`})
      })
    } else {
      return message.reply({content: `\`${channel.name}\` is not a supported channel`})
    }
    return message.reply({content: `\`${channel.name}\` is now unlocked 🔓`})
    
  },
}
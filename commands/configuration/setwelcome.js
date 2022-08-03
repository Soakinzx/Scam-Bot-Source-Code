const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setwelcome",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$setwelcome <text channel>"],
  description: "set welcome channel",
  run:async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args.length) return message.reply({content: "Must specify an argument: `#TextChannel`"})
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if(!channel) return message.reply({content: `Text Channel Not Found`})
    if(channel.type !== "GUILD_TEXT") return message.reply({content: "Channel Found But is Not a Text Channel"})
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    if(!data){
      gs.welcome_channel = channel.id
      data.save()
      return message.reply({content: `Set Welcome Channel to ${channel}`})
    } else {
      data.welcome_channel = channel.id
      data.save()
      
      return message.reply({content: `Set Welcome Channel to ${channel}`})
    }
    
},
}


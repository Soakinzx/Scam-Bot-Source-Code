const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
module.exports = {
  name: "unban",
  aliases: [],
  permission: ["BAN_MEMBERS"],
  category: "moderation",
  req_perms: ["BAN_MEMBERS", "SEND_MESSAGES"],
  usage: ["$unban <user id>"],
  description: "unban a user",
  run: async (client, message, args) => {

    let id = args[0]
    if(!id) return message.reply({content: "Argument Missing: `member id`"})
    if(isNaN(id)) return message.reply({content: "Argument Invalid: `member id`"})  
    
    try{
      await message.guild.bans.remove(id).then((user) => {
        return message.reply({content: `Unbanned ${user.tag}`})
      }).catch(err => {
        return message.reply({content: `${err}`})
      })
    } catch(err){
      return message.reply({content: `${err}`})
    }

  },
}
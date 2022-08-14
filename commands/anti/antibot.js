const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antibot",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MEMBERS", "KICK_MEMBERS"],
  usage: ["$antibot"],
  description: "enable antibot",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    
    if(!data){
      
      gs.antibot = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antibot Toggled \`${data.antibot}\``})
    } else {
      
      if(data.antibot == true){
        data.antibot = false
        message.reply({content: `antibot Toggled \`${data.antibot}\``})
      } else {
        data.antibot = true
        message.reply({content: `antibot Toggled \`${data.antibot}\``})
      }
      data.save()
    }
  },
}

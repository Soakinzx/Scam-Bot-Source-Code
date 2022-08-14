const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antijoin",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MEMBERS", "KICK_MEMBERS"],
  usage: ["$antijoin"],
  description: "enable antijoin",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    
    if(!data){
     
      gs.antijoin = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antijoin Toggled \`${data.antijoin}\``})
    } else {
      
      if(data.antijoin == true){
        data.antijoin = false
        message.reply({content: `antijoin Toggled \`${data.antijoin}\``})
      } else {
        data.antijoin = true
        message.reply({content: `antijoin Toggled \`${data.antijoin}\``})
      }
      data.save()
    }
  },
}

const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antimessage",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$antimessage"],
  description: "enable antimessage",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    
    if(!data){
      
      gs.antimessage = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antimessage Toggled \`${data.antimessage}\``})
    } else {
      
      if(data.antimessage == true){
        data.antimessage = false
        message.reply({content: `antimessage Toggled \`${data.antimessage}\``})
      } else {
        data.antimessage = true
        message.reply({content: `antimessage Toggled \`${data.antimessage}\``})
      }
      data.save()
    }
  },
}

const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "statusmessage",
  aliases: ["statusmsg"],
  category: "configuration",
  permission: [],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$statusmessage"],
  description: "view the server status message",
  run:async (client, message, args) => {
    
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    if(!data){
      return message.reply({content: `Please enable \`Status Role\` And Set a \`Status Message\` to see the server status role message!`})
    } else {
      if(data.status_message == null || data.status_message == "") return message.reply({content: `Set a \`Status Message\` to see the server status role message!`})
      
      return message.reply({content: `Server Status Message: \`${data.status_message}\``})
    }
    
},
}





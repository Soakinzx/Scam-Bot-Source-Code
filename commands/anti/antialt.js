const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antialt",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MEMBERS", "KICK_MEMBERS"],
  usage: ["$antialt"],
  description: "enable antialt",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    
    if(!data){
      
      gs.antialt = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antialt Toggled \`${data.antialt}\``})
    } else {
      
      if(data.antialt == true){
        data.antialt = false
        message.reply({content: `antialt Toggled \`${data.antialt}\``})
      } else {
        data.antialt = true
        message.reply({content: `antialt Toggled \`${data.antialt}\``})
      }
      data.save()
    }
  },
}

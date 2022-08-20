const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antilink",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$antilink"],
  description: "enable antilink",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    
    if(!data){
      
      gs.antilink = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antilink Toggled \`${data.antilink}\``})
    } else {
      
      if(data.antilink == true){
        data.antilink = false
        message.reply({content: `antilink Toggled \`${data.antilink}\``})
      } else {
        data.antilink = true
        message.reply({content: `antilink Toggled \`${data.antilink}\``})
      }
      data.save()
    }
  },
}

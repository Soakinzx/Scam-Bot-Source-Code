const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antinuke",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "ADMINISTRATOR"],
  usage: ["$antinuke"],
  description: "enable antinuke",
  run: async (client, message, args) => {
    if(!client.owners.includes(message.author.id)) return message.reply({content: "Being worked on..."})
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    
    if(!data){
      
      gs.antinuke = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antinuke Toggled \`${data.antinuke}\``})
    } else {
      
      if(data.antinuke == true){
        data.antinuke = false
        message.reply({content: `antinuke Toggled \`${data.antinuke}\``})
      } else {
        data.antinuke = true
        message.reply({content: `antinuke Toggled \`${data.antinuke}\``})
      }
      data.save()
    }
  },
}

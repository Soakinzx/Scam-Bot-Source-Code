const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "trusted",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "OWNER"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$trusted"],
  description: "see all trusted members",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      
      return message.reply({content: `There are no current trusted members`})
    } else {
      
      if(data.auto_roles.length == 0) return message.reply({content: `There are no current trusted members`})
      let embed = new MessageEmbed()
      .setTitle("trusted Members")
      .setDescription(data.trusted.map(id => {
        return `\`${message.guild.members.cache.get(id).user.username || "Unknown"}\``
    }).join(", "))
      message.channel.send({embeds: [embed]})
    }
  },
}

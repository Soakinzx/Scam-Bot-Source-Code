const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "autoroles",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR", "MANAGE_ROLES"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$autoroles"],
  description: "see all autoroles",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      return message.reply({content: `There are no current roles in the server auto roles list`})
    } else {
      if(data.auto_roles.length == 0) return message.reply({content: `There are no current roles in the server auto roles list`})
      let embed = new MessageEmbed()
      .setTitle("Auto Roles")
      .setDescription(data.auto_roles.map(r => {
      let role= message.guild.roles.cache.get(r)
      if(role){
        return `${role}`
      } else {
        return `<@&${r}>`
      }
    }).join(", "))
      message.channel.send({embeds: [embed]})
    }
  },
}

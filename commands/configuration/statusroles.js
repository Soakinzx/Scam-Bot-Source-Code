const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "statusroles",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR", "MANAGE_ROLES"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$statusroles"],
  description: "see all status roles set",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      return message.reply({content: `There are no current roles in the server status roles list`})
    } else {
      if(data.auto_roles.length == 0) return message.reply({content: `There are no current roles in the server status roles list`})
      let embed = new MessageEmbed()
      .setTitle("Status Roles")
      .setDescription(data.status_roles.map(r => {
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

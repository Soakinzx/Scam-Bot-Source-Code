const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "statusrole",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$statusrole <role>"],
  description: "add/remove a role to the status role server list",
  run:async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args[0]) return message.reply({content: "Argument Missing: `@role`"})
    
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if(!role) return message.reply({content: "Argument Invalid: `@role`"})
    
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    if(!data){
      return message.reply({content: `Please enable \`Status Role\` to set the server status message!`})
    } else {
      if(data.status_role == false) return message.reply({content: `Please enable \`Status Role\` to set the server status message!`})
      if(!data.status_roles.includes(role.id)){
        data.status_roles.push(role.id)
        data.save()
        return message.reply({content: `Added \`${role.name}\` To Status Roles List`})
      } else {
        data.status_roles.splice(data.status_roles.indexOf(role.id),1)
        data.save()
        return message.reply({content: `Removed \`${role.name}\` From Status Roles List`})
      }
    }
    
},
}





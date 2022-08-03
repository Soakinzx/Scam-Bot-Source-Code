const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setstatusrole",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$setstatusrole <true/false>"],
  description: "enabled status role",
  run:async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args[0]) return message.reply({content: "Must specify an argument: `true/false`"})
    let argument1 = args[0].toLowerCase()
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    if(!data){
      if(argument1 == "true"){
      if(gs.status_role == true) return message.reply({content: "Status Role is already enabled"})
      gs.status_role = true
    } else if(argument1 == "false"){
      if(gs.status_role == false) return message.reply({content: "Status Role is already disabled"})
      gs.status_role = false
    } else {
      return message.reply({content: "Must specify a valid argument: `true/false`"})
    }
      data = new gdb(gs)
      data.save()
      return message.reply({content: `Status Role set to \`${data.status_role}\``})
    } else {
      if(argument1 == "true"){
      if(data.status_role == true) return message.reply({content: "Status Role is already enabled"})
      data.status_role = true
      data.save()
      return message.reply({content: `Status Role set to \`${data.status_role}\``})
    } else if(argument1 == "false"){
      if(data.status_role == false) return message.reply({content: "Status Role is already disabled"})
      data.status_role = false
      data.save()
      return message.reply({content: `Status Role set to \`${data.status_role}\``})
    } else {
      return message.reply({content: "Must specify a valid argument: `true/false`"})
    }
    }
    
},
}





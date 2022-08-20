const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setsaveroles",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$setsaveroles <true/false>"],
  description: "enable save user roles when they leave",
  run:async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args[0]) return message.reply({content: "Must specify an argument: `true/false`"})
    let argument1 = args[0].toLowerCase()
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    if(!data){
      if(argument1 == "true"){
      if(gs.save_roles == true) return message.reply({content: "Save Roles is already enabled"})
      gs.save_roles = true
    } else if(argument1 == "false"){
      if(gs.save_roles == false) return message.reply({content: "Save Roles is already disabled"})
      gs.save_roles = false
    } else {
      return message.reply({content: "Must specify a valid argument: `true/false`"})
    }
      data = new gdb(gs)
      data.save()
      return message.reply({content: `Save Roles set to \`${data.save_roles}\``})
    } else {
      if(argument1 == "true"){
      if(data.save_roles == true) return message.reply({content: "Save Roles is already enabled"})
      data.save_roles = true
      data.save()
      return message.reply({content: `Save Roles set to \`${data.save_roles}\``})
    } else if(argument1 == "false"){
      if(data.save_roles == false) return message.reply({content: "Save Roles is already disabled"})
      data.save_roles = false
      data.save()
      return message.reply({content: `Save Roles set to \`${data.save_roles}\``})
    } else {
      return message.reply({content: "Must specify a valid argument: `true/false`"})
    }
    }
    
},
}
/*
const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setsaveroles",
  aliases: [],
  category: "configuration",
  permission: [],
  usage: ["$setsaveroles"],
  description: "fetches info about the server",
  run:async (client, message, args) => {
    
},
}





  */





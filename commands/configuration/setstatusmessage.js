const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setstatusmessage",
  aliases: ["setstatusmsg"],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$setstatusmessage <message/reset>"],
  description: "set the status required for the roles in the server status roles list",
  run:async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args.join(" ")) return message.reply({content: "Must specify an argument: `message`"})
    let argument = args.join(" ").toLowerCase()
    if(argument.length > 128) return message.reply({content: `Argument invalid: \`message: must be less than 128 characters\``})
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    if(!data){
      return message.reply({content: `Please enable \`Status Role\` to set the server status message!`})
    } else {
      if(data.status_role == false) return message.reply({content: `Please enable \`Status Role\` to set the server status message!`})
      if(argument.toLowerCase() == "reset") {
        data.status_message = null
        data.save()
        return message.reply({content: `Status Role Message Reset`})
      }
      data.status_message = argument
      data.save()
      return message.reply({content: `Status Role Message Set To \`${data.status_message}\``})
    }
    
},
}





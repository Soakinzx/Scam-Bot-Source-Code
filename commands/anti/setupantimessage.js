const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setupantimessage",
  aliases: ["configantimessage", "configureantimessage"],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$setamountofmessagespertime 10"],
  description: "configure antinuke settings",
  run: async (client, message, args) => {

    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if(!args[0]) return message.reply({
      content: "Argument Missing: `action: messages, time`"
    })

    let action = args[0].toLowerCase()
    if(action == "messages") {
      let argument = parseInt(args[1])
      if(!argument) return message.reply({
        content: "Argument Missing: `number`"
      })
      if(isNaN(argument)) return message.reply({
        content: "Argument Invalid: `number: must be an integer`"
      })
      if(argument > 100 || argument < 1) {
        return message.reply({
          content: "Argument Invalid: `number: must be less or equal to 100 and greater than or equal to 1`"
        })
      }
      let data = await functions.getdb(gdb, {
        _id: message.guild.id
      })
      if(!data) {

        gs.antimessage_mps = argument
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Set Anti-Message Amount Of Messages Per Time \`${data.antimessage_mps}\``
        })
      } else {

        data.antimessage_mps = argument
        data.save()
        return message.reply({
          content: `Set Anti-Message Amount Of Messages Per Time \`${data.antimessage_mps}\``
        })
      }
    } else if(action == "time") {
      let argument = parseInt(args[1])
      if(!argument) return message.reply({
        content: "Argument Missing: `number`"
      })
      if(isNaN(argument)) return message.reply({
        content: "Argument Invalid: `number: must be an integer`"
      })
      if(argument > 60 || argument < 1) {
        return message.reply({
          content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
        })
      }

      let data = await functions.getdb(gdb, {
        _id: message.guild.id
      })
      if(!data) {
        if(message.member.id !== message.guild.ownerId) return message.reply({
          content: `You do not have the required trust role \`Not Set\` and You are not on the trusted list and You are not the owner of this server`
        })
        gs.antimessage_seconds = argument
        data = new gdb(gs)
        data.save()
        return message.reply({
          content: `Set Anti-Message Time \`${data.antimessage_seconds}\``
        })
      } else {
        
        data.antimessage_seconds = argument
        data.save()
        return message.reply({
          content: `Set Anti-Message Time \`${data.antimessage_seconds}\``
        })
      }
    } else {
      return message.reply({
        content: "Argument Invalid: `action: messages, time`"
      })
    }
  },
}
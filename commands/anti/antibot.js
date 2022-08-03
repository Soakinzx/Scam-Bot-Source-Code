const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antibot",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$antibot"],
  description: "enable antibot",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    
    if(!data){
      let role = message.guild.roles.cache.get(data.trustrole)
      if(!role){
        role = "Not Set"
      } else {
        role = role.name
      }
      if (message.member.id !== message.guild.ownerId && !message.member.roles.cache.has(data.trustrole) && !data.trusted.includes(message.author.id)) return message.reply({
          content: `You do not have the required trust role \`${role}\` and You are not on the trusted list and You are not the owner of this server`
      })
      gs.antibot = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antibot Toggled \`${data.antibot}\``})
    } else {
      let role = message.guild.roles.cache.get(data.trustrole)
      if(!role){
        role = "Not Set"
      } else {
        role = role.name
      }
      if (message.member.id !== message.guild.ownerId && !message.member.roles.cache.has(data.trustrole) && !data.trusted.includes(message.author.id)) return message.reply({
          content: `You do not have the required trust role \`${role}\` and You are not on the trusted list and You are not the owner of this server`
      })
      if(data.antibot == true){
        data.antibot = false
        message.reply({content: `antibot Toggled \`${data.antibot}\``})
      } else {
        data.antibot = true
        message.reply({content: `antibot Toggled \`${data.antibot}\``})
      }
      data.save()
    }
  },
}

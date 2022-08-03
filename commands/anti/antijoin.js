const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antijoin",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$antijoin"],
  description: "enable antijoin",
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
      gs.antijoin = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antijoin Toggled \`${data.antijoin}\``})
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
      if(data.antijoin == true){
        data.antijoin = false
        message.reply({content: `antijoin Toggled \`${data.antijoin}\``})
      } else {
        data.antijoin = true
        message.reply({content: `antijoin Toggled \`${data.antijoin}\``})
      }
      data.save()
    }
  },
}

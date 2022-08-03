const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "antinuke",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "ADMINISTRATOR"],
  usage: ["$antinuke"],
  description: "enable antinuke",
  run: async (client, message, args) => {
    if(!client.owners.includes(message.author.id)) return message.reply({content: "Being worked on..."})
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
      gs.antinuke = true
      data = new gdb(gs)
      data.save()
      return message.reply({content: `antinuke Toggled \`${data.antinuke}\``})
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
      if(data.antinuke == true){
        data.antinuke = false
        message.reply({content: `antinuke Toggled \`${data.antinuke}\``})
      } else {
        data.antinuke = true
        message.reply({content: `antinuke Toggled \`${data.antinuke}\``})
      }
      data.save()
    }
  },
}

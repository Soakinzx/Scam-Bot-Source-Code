const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "trusted",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$trusted"],
  description: "see all trusted members",
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
      return message.reply({content: `There are no current trusted members`})
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
      if(data.auto_roles.length == 0) return message.reply({content: `There are no current trusted members`})
      let embed = new MessageEmbed()
      .setTitle("trusted Members")
      .setDescription(data.trusted.map(id => {
        return `\`${message.guild.members.cache.get(id).user.username || "Unknown"}\``
    }).join(", "))
      message.channel.send({embeds: [embed]})
    }
  },
}

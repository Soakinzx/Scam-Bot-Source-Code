
const Discord = require("discord.js")
module.exports = {
  name: "owner",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "show servers owner",
  usage: ["$owner"],
  run: async (client, message, args) => {
    let owner = message.guild.members.cache.get(message.guild.ownerId)
    let embed = new Discord.MessageEmbed()
    .setTitle(`${message.guild.name}'s Owner`)
    .setDescription(`**Tag:** ${owner.user.tag}\n**Nickname:** ${owner.nickname || "None"}\n**ID:** ${owner.id}`)
    .setColor("DARK_BUT_NOT_BLACK")
    
    
    message.channel.send({embeds:[embed]})
},
}

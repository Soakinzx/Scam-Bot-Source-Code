
const Discord = require("discord.js")
module.exports = {
  name: "membercount",
  aliases: ["memberscount"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "show servers member count",
  usage: ["$membercount"],
  run: async (client, message, args) => {
    
    let embed = new Discord.MessageEmbed()
    .setTitle(`${message.guild.name}'s Member Count`)
    .setDescription(`**Humans:** ${message.guild.members.cache.filter(m => !m.user.bot).size}\n**Bots:** ${message.guild.members.cache.filter(m => m.user.bot).size}\n**Total:** ${message.guild.members.cache.size}`)
    .setColor("DARK_BUT_NOT_BLACK")
    
    
    message.channel.send({embeds:[embed]})
},
}

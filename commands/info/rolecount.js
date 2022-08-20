
const Discord = require("discord.js")
module.exports = {
  name: "rolecount",
  aliases: ["rolescount"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "show servers role count",
  usage: ["$rolecount"],
  run: async (client, message, args) => {
    
    let embed = new Discord.MessageEmbed()
    .setTitle(`${message.guild.name}'s Role Count`)
    .setDescription(`**Roles:** ${message.guild.roles.cache.size}`)
    .setColor("DARK_BUT_NOT_BLACK")
    
    
    message.channel.send({embeds:[embed]})
},
}


const Discord = require("discord.js")
module.exports = {
  name: "serverbanner",
  aliases: ["sb"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "shows server banner",
  usage: ["$serverbanner"],
  run: async (client, message, args) => {
    let banner = message.guild.bannerURL({size: 2048, dynamic: true, format: "webp"})
    if(!banner) return message.reply({content: `Server Does Not Have A Server Banner`})
    let row = new Discord.MessageActionRow()
    row.components.push(new Discord.MessageButton().setStyle("LINK").setLabel("Server Banner").setURL(banner))
    let embed = new Discord.MessageEmbed()
    .setTitle(`${message.guild.name}'s Server Banner`)
    .setImage(banner)
    .setFooter(`ID: ${message.guild.id}`, message.guild.iconURL({dynamic: true}))
    message.channel.send({embeds:[embed], components: [row]})
},
}


const Discord = require("discord.js")
module.exports = {
  name: "invitebanner",
  aliases: ["ib"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "shows server invite banner",
  usage: ["$invitebanner"],
  run: async (client, message, args) => {
    let banner = message.guild.splashURL({size: 4096, dynamic: true, format: "webp"})
    if(!banner) return message.reply({content: `Server Does Not Have A Invite Banner`})
    let row = new Discord.MessageActionRow()
    row.components.push(new Discord.MessageButton().setStyle("LINK").setLabel("Invite Banner").setURL(banner))
    let embed = new Discord.MessageEmbed()
    .setTitle(`${message.guild.name}'s Invite Banner`)
    .setImage(banner)
    .setFooter(`ID: ${message.guild.id}`, message.guild.iconURL({dynamic: true}))
    message.channel.send({embeds:[embed], components: [row]})
},
}

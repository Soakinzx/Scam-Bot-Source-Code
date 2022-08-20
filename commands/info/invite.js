
const Discord = require("discord.js")

module.exports = {
  name: "invite",
  aliases: ["support", "vote"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "invite and support server link",
  usage: ["$invite"],
  run: async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setDescription(`Support Me By Inviting Me To Your Server Or Voting!`)
    .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
    .setTimestamp()
    .setFooter(`${client.user.id}`, client.user.displayAvatarURL({dynamic: true}))
    .setAuthor(`${client.user.tag}`, client.user.displayAvatarURL({dynamic: true}))

    let row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
      .setStyle("LINK")
      .setURL(client.invite_link)
      .setLabel("Invite"),
      new Discord.MessageButton()
      .setStyle("LINK")
      .setURL(client.server_link)
      .setLabel("Server Invite"),
      new Discord.MessageButton()
      .setStyle("LINK")
      .setURL(client.vote_link)
      .setLabel("Vote!")
    )
    return message.channel.send({embeds: [embed], components: [row]})
},
}

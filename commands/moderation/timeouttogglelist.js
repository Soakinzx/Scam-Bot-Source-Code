const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
const functions = require("../../functions.js")
module.exports = {
  name: "timeouttogglelist",
  aliases: ["ttl"],
  permission: ["MODERATE_MEMBERS"],
  req_perms: ["SEND_MESSAGES", "MODERATE_MEMBERS"],
  category: "moderation",
  usage: ["$timeouttogglelist"],
  description: "view all users who have toggle auto untimeout set",
  run: async (client, message, args) => {
    let data = await functions.getdb(db, {_id: message.guild.id})
    if(!data || data.toggletimeout_list.length == 0) return message.reply({content: "There are no users on the auto untimeout list"})
    let embed = new MessageEmbed()
    .setTitle("Auto Untimeout Toggle List")
    .setDescription(data.toggletimeout_list.map(m => {
      let member = message.guild.members.cache.get(m)
      if(member){
        return `\`${member.user.username}\``
      }
    }).join(", "))

    message.channel.send({embeds: [embed]})
  },
}
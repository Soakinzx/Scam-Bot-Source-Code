const { MessageEmbed } = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")
//ends with 0,4,5,6,7,8,9: th
//ends with 1: st, if is greater than 100 and ends with 1 :th

module.exports = {
  name: "variables",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$variables"],
  description: "see all variables",
  run:async (client, message, args) => {
    //return message.reply({content: "Being worked on..."})
    let variables = [
      "{member.id}",
      "{member.name}",
      "{member.username}",
      "{member.tag}",
      "{member.avatar}",
      "{member.animatedavatar}",
      "{member.avatarurl}",
      "{member.mention}",
      "{user.id}",
      "{user.name}",
      "{user.username}",
      "{user.tag}",
      "{user.avatar}",
      "{user.animatedavatar}",
      "{user.avatarurl}",
      "{user.mention}",
      "{guild.name}",
      "{guild.icon}",
      "{guild.animatedicon}",
      "{guild.iconurl}",
      "{guild.membercount}",
      "{guild.membercountformatted}",
      "{guild.owner}",
      "{guild.ownertag}",
      "{guild.ownername}",
      "{guild.id}",
      "{server.name}",
      "{server.icon}",
      "{server.animatedicon}",
      "{server.iconurl}",
      "{server.membercount}",
      "{server.membercountformatted}",
      "{server.owner}",
      "{server.ownertag}",
      "{server.ownername}",
      "{server.id}"
    ]

    let embed = {
      title: "Variables",
      description: variables.map(v => `\`${v}\``).join("\n")
    }
    return message.channel.send({embeds: [embed]})
    
},
}





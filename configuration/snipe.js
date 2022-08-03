const Discord = require("discord.js")
let gdb = require("../../Models/Guild")
let functions = require("../../functions.js")
module.exports = {
  name: "snipe",
  aliases: ["s"],
  permission: [],
  category: "configuration",
  req_perms: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
  usage: ["$snipe <optional: 1/2/3>"],
  description: "snipe last deleted message",
  run: async (client, message, args) => {
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    let user = "Nobody"
    let content = "None"
    
    if(data){
      user = client.users.cache.get(data.sniped_message.id).tag || "Not Found"
      content = data.sniped_message.content || "Not Found"
    }
    
    embed = new Discord.MessageEmbed()
      .setTitle(`Sniped from ${user}`)
      .setDescription(`${content}`)
      .setColor("DARK_BUT_NOT_BLACK")

  message.channel.send({
    embeds: [embed]
  })
},
}
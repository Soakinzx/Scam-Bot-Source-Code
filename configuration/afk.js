
const moment = require("moment")
const Discord = require("discord.js")
const db = require("../../Models/Guild")
const functions = require("../../functions.js")
module.exports = {
  name: "afk",
  aliases: [],
  category: "configuration",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "set your afk",
  usage: ["$afk <optional: status>"],
  run: async (client, message, args) => {
  const reason = args.join(" ") || "AFK"
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
  db.findOne({_id: message.guild.id}, async (err, data) => {
    if(err) throw err
    let name = message.member.displayName || message.member.username
    if(!data){
      gs.afk_list = [{id: message.author.id, message: reason, date: Date.now()}]
      data = new db(gs)
      data.save()
      let embed = new Discord.MessageEmbed()
    .setTitle("AFK SET")
    .setDescription(`AFK: ${reason}`)
    .setColor("DARK_BUT_NOT_BLACK")
    .setTimestamp()
      message.member.setNickname(`[AFK]${name}`).catch({})
      return message.reply({embeds:[embed]})
    } else if(data) {
      data.afk_list.push({id: message.author.id, message: reason, date: Date.now()})
      data.save()
      let embed = new Discord.MessageEmbed()
    .setTitle("AFK SET")
    .setDescription(`AFK: ${reason}`)
    .setColor("DARK_BUT_NOT_BLACK")
    .setTimestamp()
      try {
        message.member.setNickname(`[AFK]${name}`).catch(err => {
        return
      })
      } catch(err){
        return
      }
  
      return message.reply({embeds:[embed]})
    }
  })
},
}


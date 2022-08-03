const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
const functions = require("../../functions.js")
module.exports = {
  name: "timeouttoggle",
  aliases: ["tt"],
  permission: ["MODERATE_MEMBERS"],
  req_perms: ["SEND_MESSAGES", "MODERATE_MEMBERS"],
  category: "moderation",
  usage: ["$timeouttoggle <user>"],
  description: "toggle auto untimeout for a user",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id

    if (!args.join(" ")) return message.reply({
      content: "Argument Missing: `@member`"
    })

    
    let user = message.mentions.members.first() || message.guild.members.cache.get(args.join(" ")) || message.guild.members.cache.find(m => m.user.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.user.tag.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if (!user) return message.reply({
      content: "Argument Invalid: `@member`"
    })
    if (user == message.member) return message.reply({
      content: "You cant toggle auto untimeout for youself"
    })
    if(message.guild.me.roles.highest.comparePositionTo(user.roles.highest) <= 0 || message.guild.ownerId === user.id) return message.reply({content: `${user} has higher/equal authority than me`})
    
    if((message.member.roles.highest.comparePositionTo(user.roles.highest) <= 0 && message.guild.ownerId !== message.member.id) || message.guild.ownerId === user.id) return message.reply({content: `${user} has higher/equal authority than you`})
    db.findOne({
      _id: message.guild.id
    }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        gs.toggletimeout_list = [user.id]
        data = new db(gs)
        message.channel.send({
          content: `${user} auto untimeout has been toggled: \`True\``
        })
        
      } else {
        if (!data.toggletimeout_list.includes(user.id)) {
          data.toggletimeout_list.push(user.id)
          message.channel.send({
            content: `${user} auto untimeout has been toggled: \`True\``
          })
        } else {
          data.toggletimeout_list.splice(data.toggletimeout_list.indexOf(user.id))
          message.channel.send({
            content: `${user} auto untimeout has been toggled: \`False\``
          })
        }
        
      }
      data.save()
      if(user.communicationDisabledUntilTimestamp !== null) {
        try{
          user.timeout(0, `untimedout by ${message.author.tag}`).catch(err => {return})
        } catch(err){
          return
        }
      } 
      
    })
  },
}
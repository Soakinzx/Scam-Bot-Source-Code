const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
module.exports = {
  name: "timeoutadd",
  aliases: ["ta"],
  permission: ["MODERATE_MEMBERS"],
  category: "moderation",
  req_perms: ["MODERATE_MEMBERS", "SEND_MESSAGES"],
  usage: ["$timeoutadd <user> <optional: time>", "$timeoutadd <user> 10s"],
  description: "add a timeout to a user",
  run: async (client, message, args) => {

    const onSwitch = client.emojis.cache.find(
      (e) => e.id === "988497446336339988"
    );
    if (!args.length) return message.reply({
      content: "Argument Missing: `@member`"
    })
    let u = args[0]
    const member = message.mentions.members.first() || message.guild.members.cache.get(u) || message.guild.members.cache.find(m => m.user.username.startsWith(u.toLowerCase())) || message.guild.members.cache.find(m => m.user.tag.startsWith(u.toLowerCase()))
    if (!member) return message.reply({
      content: "Argument Invalid: `@member`"
    })
    
    if (member == message.member) return message.reply({
      content: "You cant time your self out"
    })
    if(message.guild.me.roles.highest.comparePositionTo(member.roles.highest) <= 0 || message.guild.ownerId === member.id) return message.reply({content: `${member} has higher/equal authority than me`})
    
    if((message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 && message.guild.ownerId !== message.member.id) || message.guild.ownerId === member.id) return message.reply({content: `${member} has higher/equal authority than you`})
    
    let time = (args[1]) ? args[1].match(/[a-zA-Z]+|[0-9]+/g) : "5m"
    if(time.length > 2 || !time[0] || isNaN(time[0]) || !time[1] || !["s", "m", "h", "d"].includes(time[1].toLowerCase())) return message.reply({content: "Argument Invalid: `time: ex. $timeoutadd @scam 10s, $timeoutadd @scam 10h, $timeoutadd @scam 10m`"})
    let num = parseInt(time[0])
    let fm = time[1].toLowerCase()
    
    if(fm == "s"){
      time = num*1000
    } else if(fm == "m"){
      time = num*60000
    } else if(fm == "h"){
      time = num*60000*60
    } else if(fm == "d"){
      time = num*60000*60*24
    }
    
    let obj = {
      "s": [604800, "The amount of seconds allowed must be less than or equal 604800(1 week) and greater than or equal to 1(1 second)", "seconds"],
      "m": [10080, "The amount of minutes allowed must be less than or equal 10080(1 week) and greater than or equal to 1(1 minute)", "minutes"],
      "h": [168, "The amount of hours allowed must be less than or equal 168(1 week) and greater than or equal to 1(1 hour)", "hours"],
      "d": [7, "The amount of days allowed must be less than or equal 7(1 week) and greater than or equal to 1(1 day)", "days"]
    }
    if (num > obj[fm][0] || time < 1) {
      return message.channel.send({
        content: obj[fm][1]
      })
    }
    try {
      
      member.timeout(time, `timedout by ${message.author.tag}`).then(() => {
        message.channel.send({
          content: `Timedout ${member} for ${num} ${obj[fm][2]}`
        })
      }).catch(err => {
        message.reply({
          content: `${err}`
        })
      });
    } catch (err) {
      message.reply({
        content: `${err}`
      })
    }

  },
}

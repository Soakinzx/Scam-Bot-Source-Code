
const Discord = require("discord.js")
const config = require("../../json/config.json")
module.exports = {
  name: "stealsticker",
  aliases: ["ss"],
  req_perms: ["MANAGE_EMOJIS_AND_STICKERS", "SEND_MESSAGES"],
  permission: ["MANAGE_EMOJIS_AND_STICKERS"],
  category: "configuration",
  description: "steals a server sticker",
  usage: ["$stealsticker <sticker(s)>"],
  run: async (client, message, args) => {
    message.guild.stickers.fetch().then(stickers => {
      let max_size = 5
      let tier = message.guild.premiumTier
      if(tier == "TIER_1") {
        max_size = 15
      }
      if(tier == "TIER_2") {
        max_size = 30
      }
      if(tier == "TIER_3") {
        max_size = 60
      }
    if(stickers.size == max_size) return message.reply({content: `Max Sticker Slots Exceeded: \`${max_size}\``})
      
    let img_urls = []
    //message.stickers.forEach(s => console.log(s.url))
    let filter = (user) => user.id === message.author.id
    let collector = message.channel.createMessageCollector(filter)
    message.reply({content: 'Send stickers in chat...Type "stop" to stop the sticker collector'})
    collector.on("collect", async (msg) => {
      
      if(msg.content.toLowerCase() == "cancel") {
        img_urls = []
        msg.reply({content: "Sticker collector stopped"})
        return collector.stop()
      }
      if(msg.content.toLowerCase() === "stop") return collector.stop()
      msg.stickers.forEach(s => {
        
        msg.reply({content: "Sticker collected"})
        return img_urls.push({url: s.url, name: s.name})
      })
      
    })
    collector.on("end", async (collected) => {
      
      
      if(img_urls.length == 0 || collected.size == 0) return;
      message.guild.stickers.fetch().then(stickers => {
      
    })
      img_urls.forEach(async (i) => {
        await message.guild.stickers.create(i.url, i.name, "slight_smile").then((sticker) => {
        let embed = new Discord.MessageEmbed()
      .setTitle("Sticker Created")
      .setImage(i.url)
      return message.channel.send({embeds: [embed]})
        
    }).catch((err) => message.reply({content: `${err}`}))
      })
    })
    })
},
}

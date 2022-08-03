
const Discord = require("discord.js")
const config = require("../../json/config.json")

module.exports = {
  name: "createsticker",
  aliases: ["cs"],
  permission: ["MANAGE_EMOJIS_AND_STICKERS"],
  req_perms: ["SEND_MESSAGES"],
  category: "configuration",
  description: "create a server sticker",
  usage: ["$createsticker <Attachments>"],
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
       
    if(message.attachments.size == 0) return message.reply({content: "You need to add an image file(s)"})
    
    let img_urls = []
    message.attachments.forEach((img) =>{
      if(img.url.includes(".gif")) return;
      return img_urls.push(img.url)
    })
    if(img_urls.length == 0) return message.reply({content: `You did not provide any valid image file(s)`})
    img_urls.forEach(async (url) => {
       
       
         var convertapi = require('convertapi')('g1jXm20eMgfAuh14');
convertapi.convert('png', {
    File: url
}, 'jpg').then(async function(result) {
    
  await message.guild.stickers.create(result.response.Files[0].Url, "Sticker", "slight_smile").then((sticker) => {
        let embed = new Discord.MessageEmbed()
      .setTitle("Sticker Created")
      .setImage(result.response.Files[0].Url)
      return message.channel.send({embeds: [embed]})
        
    }).catch((err) => message.reply({content: `${err}`}))
}).catch(err => {
  return;
})
      
      
        
    })
     }).catch(err => {
       return
     })
  },
}

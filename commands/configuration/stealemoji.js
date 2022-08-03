const discord = require("discord.js");

module.exports = {
  name: "stealemoji",
  description: "steal an emoji etc",
  permission: ["MANAGE_EMOJIS_AND_STICKERS"],
  req_perms: ["MANAGE_EMOJIS_AND_STICKERS", "SEND_MESSAGES"],
  category: "configuration",
  usage: ["$stealemoji <emoji>"],
  aliases: ["steal-emoji", "se"],
  run: async (client, message, args) => {
    let max_size = 50
    let tier = message.guild.premiumTier
    if(tier == "TIER_1") {
      max_size = 100
    }
    if(tier == "TIER_2") {
      max_size = 150
    }
    if(tier == "TIER_3") {
      max_size = 250
    }
    if(message.guild.emojis.cache.size == max_size) return message.reply({content: `Max Emoji Slots Exceeded: \`${max_size}\``})
    if(!args.length) return message.reply("Specify an emoji(s)")
    
    for(const re of args){
      const pe = discord.Util.parseEmoji(re)

      if(pe.id){
        const extenstion = pe.animated ? ".gif" : ".png"
        const url = `https://cdn.discordapp.com/emojis/${pe.id + extenstion}`
        message.guild.emojis.create(url, pe.name).then((emoji) => {
          let embed = new discord.MessageEmbed()
          .setTitle("Emoji stolen")
          .setDescription(`**Name:** ${emoji.name}\n**Emoji:** ${emoji}\n**Id:** ${emoji.id}`)
          .setURL(emoji.url)
          message.channel.send({embeds: [embed]})
        }).catch(err => {
          return message.reply({content: `${err}`})
        })
      } else {
        message.channel.send({content: "Not an emoji/supported"})
      }
    }
  }
};
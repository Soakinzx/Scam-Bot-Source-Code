const discord = require("discord.js")
let functions = require("../../functions.js")
module.exports = {
  name: "grey",
  aliases: ["greyscale"],
  category: "image",
  permission: [],
  usage: ["$grey <optional: user/attachment>"],
  req_perms: ["SEND_MESSAGES"],
  description: "grey scale a user avatar/attachment",
  run: async (client, message, args) => {
    let urls = []
    message.attachments.forEach((img) =>{
      if(!img.url) return;
      return urls.push(img.url)
    })
    if (urls[0]) {
      let url = `https://api.popcat.xyz/greyscale?image=${urls[0].replace(".webp", ".jpg")}`
      let embed = {
        title: "Grey Scaled",
        image: {
          url: url
        }
      }
      return message.channel.send({
        embeds: [embed]
      })
    } else {
      let u = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(i => i.user.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.guild.members.cache.find(i => i.user.tag.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.member
      if(!args[0]) {
        u = message.member
      }
      let url = `https://api.popcat.xyz/greyscale?image=${u.displayAvatarURL().replace(".webp", ".jpg")}`
      let embed = {
        title: "Grey Scaled",
        image: {
          url: url
        }
      }
      return message.channel.send({
        embeds: [embed]
      })
    }

  }
}
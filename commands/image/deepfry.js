const discord = require("discord.js")
let functions = require("../../functions.js")
let axios = require("axios")
module.exports = {
  name: "deepfry",
  aliases: [],
  category: "image",
  permission: [],
  usage: ["$deepfry <optional: user/attachment>"],
  req_perms: ["SEND_MESSAGES"],
  description: "deepfry a user avatar/attachment",
  run: async (client, message, args) => {
    let urls = []
    message.attachments.forEach((img) =>{
      if(!img.url) return;
      return urls.push(img.url)
    })
    if (urls[0]) {
      let url = `https://nekobot.xyz/api/imagegen?type=deepfry&image=${urls[0].replace(".webp", ".jpg")}`
      let res = await axios.get(url)
      let embed = {
        title: "Deepfried",
        image: {
          url: res.data.message
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
      let url = `https://nekobot.xyz/api/imagegen?type=deepfry&image=${u.displayAvatarURL().replace(".webp", ".jpg")}`
      let res = await axios.get(url)
      let embed = {
        title: "Deepfried",
        image: {
          url: res.data.message
        }
      }
      return message.channel.send({
        embeds: [embed]
      })
    }

  }
}

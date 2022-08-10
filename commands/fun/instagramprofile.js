const {
  VKontakte,
  Instagram,
  Facebook,
  Snapchat,
  Twitter,
  YouTube,
  TikTok
} = require('social-downloader-cherry');

let functions = require("../../functions.js")
module.exports = {
  name: "instagramprofile",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$instagramprofile <username>"],
  req_perms: ["SEND_MESSAGES"],
  description: "get instagram user info",
  run: async (client, message, args) => {

    if (!args.join(" ")) return message.reply({
      content: "Argument Missing: `instagram username`"
    })
    let username = args.join(" ")
    const res = await Instagram.getStories(username)
    if (res.data.hasError) return message.reply({
      content: res.data.errorMessage
    })

    let profile = res.data.body.profile
    let length = (res.data.body.stories) ? res.data.body.stories.length : 0
    let embed = {
      title: `${profile.username}'s instagram`,
      description: `Avatar - [link](${profile.profile_pic_url})`,
      fields: [{
        name: `Profile`,
        value: `**Full Name:** \`${profile.full_name}\`\n**Is Private?:** \`${(profile.is_private) ? "Yes" : "No"}\`\n**Followers:** \`${profile.edge_followed_by.count}\`\n**Following:** \`${profile.edge_follow.count}\`\n**Stories:** \`${length}\``,
        inline: true
      }],
      image: {
        url: profile.profile_pic_url
      },
      author: {
        name: `${profile.full_name}`,
        url: profile.profile_pic_url
      },
      footer: {
        text: `${profile.id}`
      }
    }
    return message.channel.send({
      embeds: [embed]
    })
  }
}

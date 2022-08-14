const {
    VKontakte,
    Instagram,
    Facebook,
    Snapchat,
    Twitter,
    YouTube,
    TikTok
} = require('social-downloader-cherry');
function convert(date) {
  let ms = (Date.now() - date)
  let secs = Math.floor(ms / 1000)
  let mins = Math.floor(secs / 60)
  let hours = Math.floor(mins / 60)
  let days = Math.floor(hours / 24)
  secs %= 60;
  mins %= 60;
  hours %= 24;
  days %= 24;
  return `${days}d ${hours}h ${mins}m ${secs}s`
}
let functions = require("../../functions.js")
module.exports = {
    name: "tiktok",
    aliases: [],
    category: "fun",
    permission: [],
    usage: ["$tiktok <video url>"],
    req_perms: ["SEND_MESSAGES"],
    description: "get the video of from a tiktok video url",
    run: async (client, message, args) => {

        if (!args.join(" ")) return message.reply({
            content: "Argument Missing: `tiktok video url`"
        })
        let url = args.join(" ")
        const resVideo = await TikTok.getVideo(url);
        if (resVideo.data.hasError) return message.reply({
            content: resVideo.data.errorMessage
        })
      
      let vid = resVideo.data.body.info.itemInfo.itemStruct
      
      let embed = {
        title: "TikTok Video Info",
        description: vid.desc,
        fields: [
          {name: "Author", value: `**Followers:** \`${vid.authorStats.followerCount}\`\n**Following:** \`${vid.authorStats.followingCount}\`\n**Likes:** \`${vid.authorStats.heartCount}\`\n**Videos:** \`${vid.authorStats.videoCount}\`\n**Nickname:** \`${vid.author.nickname}\`\n**Bio:** \`${vid.author.signature}\``, inline: true},
          {name: "Video", value: `**Created:** \`${convert(vid.createTime)}\``}
        ],
        footer: {
          text: `👍 ${vid.stats.diggCount} 💬 ${vid.stats.commentCount} 👁️ ${vid.stats.playCount} | ${vid.id}`
        }
      }
      message.channel.send({content: resVideo.data.body.info.itemInfo.itemStruct.video.playAddr})
        message.channel.send({
            embeds: [embed]
        })
    }
}

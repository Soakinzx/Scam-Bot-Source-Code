const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
function convert(date) {
  let ms = (Date.now() - date)
  let secs = Math.floor(ms / 1000)
  let mins = Math.floor(secs / 60)
  let hours = Math.floor(mins / 60)
  let days = Math.floor(hours / 24)
  secs %= 60;
  mins %= 60;
  hours %= 24;
  return `${days}d ${hours}h ${mins}m ${secs}s`
}
module.exports = {
  name: "github",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$github <user>"],
  req_perms: ["SEND_MESSAGES"],
  description: "get info on a github user",
  run: async (client, message, args) => {
    if(!args.length) return message.reply({
      content: "Argument Missing: `user`"
    })
    request(`https://api.popcat.xyz/github/${args.join(" ")}`, async (err, res, body) => {
      if(err) return;
      let json = JSON.parse(body)
      let embed = {
        title: "Github"
      }
      if(json.error) {
        embed.description = json.error
      } else {
        embed.description = json.bio
        embed.fields = [{
          name: "Info",
          value: `**Name:** \`${json.name}\`\n**Account Type:** \`${json.account_type}\`**Location:** \`${json.location}\`\n**Public Repos:** \`${json.public_repos}\`\n**Public Gists:** \`${json.public_gists}\`\n**Followers:** \`${json.followers}\`\n**Following:** \`${json.following}\`\n**Created At:** \`${new Date(json.created_at).toLocaleDateString("en-US")}(${convert(new Date(json.created_at))})\`\n**Updated At:** \`${new Date(json.updated_at).toLocaleDateString("en-US")}(${convert(new Date(json.updated_at))})\``,
          inline: true
        },
        {
        name: "Socials",
        value: `**Blog:** \`${json.blog}\`\n**Company:** \`${json.company}\`\n**Email:** \`${json.email}\`\n**Location:** \`${json.location}\`\n**Twitter:** \`${json.twitter}\``,
        inline: true
        }
    ]
        embed.thumbnail = {
          url: json.avatar
        }
        embed.url = json.url
      }
      return message.channel.send({
        embeds: [embed]
      })
    })
  }
}

const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "github",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$github <user>"],
  req_perms: ["SEND_MESSAGES"],
  description: "get info on a github user",
  run: async (client, message, args) => {


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
          embed.fields = [
              {name: "Info", value: `**Name:** \`${json.name}\`\n**Account Type:** \`${json.account_type}\`\n**Blog:** \`${json.blog}\`\n**Company:** \`${json.company}\`\n**Email:** \`${json.email}\`\n**Location:** \`${json.location}\`\n**Twitter:** \`${json.twitter}\`\n**Public Repos:** \`${json.public_repos}\`\n**Public Gists:** \`${json.public_gists}\`\n**Followers:** \`${json.followers}\`\n**Following:** \`${json.following}\`\n**Created At:** \`${json.created_at}\`\n**Updated At:** \`${json.updated_at}\``, inline: true}
          ]
          embed.thumbnail = {
              url: json.avatar
          }
          embed.url = json.url
      }
      return message.channel.send({embeds: [embed]})
    })

  }
}

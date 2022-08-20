const request = require("request")
const functions = require("../../functions.js")
const Discord = require("discord.js")
module.exports = {
  name: "minecraftserver",
  category: "fun",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "get info on a minecraft server",
  usage: ["$minecraftserver <server ip>"],
  run: async (client, message, args) => {
    const ip = args[0]
    if(!ip) return message.reply({content: "Argument Missing: `server ip`"})
    const url = "https://eu.mc-api.net/v3/server/ping/" + ip
    request({
      method: 'GET',
      url: url
    }, (err, res, body) => {
      if(err) return;
      
      
      if(res.statusCode !== 200) {
        return message.reply({
          content: `Could Not Ping Server \`${ip}\` With Error Code: ${res.statusCode}`
        })
      } else {
        let info = JSON.parse(body)
        let embed = {
          title: `Minecraft Server Info`,
          description: `${info.description}`,
          fields: [{
              name: `Players`,
              value: `${functions.text_block(`${info.players.online}/${info.players.max}`)}`,
              inline: true
            },
            {
              name: `Status`,
              value: `${functions.text_block(`${(info.online)?"Online":"Offline"}`)}`,
              inline: true
            }
          ],
          url: "https://"+ip,
          thumbnail: {
            url: info.favicon
          },
          footer: {
              text: `Took ${info.took}ms to get minecraft server`
          }
        }
        message.channel.send({
          embeds: [embed]
        })
      }
    });
  },
}

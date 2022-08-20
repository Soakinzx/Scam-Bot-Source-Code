const request = require("request")
const Discord = require("discord.js")
module.exports = {
  name: "gifify",
  category: "fun",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "turn a video into a gif",
  usage: ["$gifify"],
  run: async (client, message, args) => {
    if(message.attachments.size == 0 && !args[0]) return message.reply({
      content: "Argument Invalid: `video url or video attachment`"
    })
    let loading = "<a:scambot_loading:1008529612701179954>"
    let finished = "<:check:1007053001720090694>"
    let failed = "❌"
    let urls = []
    message.attachments.forEach(a => urls.push(a.url))
    let vid_url;
    if(args[0]) {
      vid_url = args[0]
    } else if(urls.length > 0) {
      if(urls[0]) {
        vid_url = urls[0]
      }
    }
    let data = {
      "fetchUrl": vid_url,
      "title": "Gifified",
      "noMd5": "true"
    }
    request.post({
      url: "https://api.gfycat.com/v1/gfycats",
      body: JSON.stringify(data)
    }, async (err, res, body) => {
      if(err) return message.reply({
        content: `${err}`
      })
      message.react(loading)
      let json_data = JSON.parse(body)
      if(!json_data.gfyname) {
        let errmsg = JSON.parse(json_data.errorMessage)
        let embed = {
          title: "Error",
          description: `**Code:** \`${errmsg.code}\`\n\`${errmsg.description}\``
        }
        message.reactions.removeAll()
        message.react(failed)
        return message.channel.send({
          embeds: [embed]
        })
      } else {
        request(`https://api.gfycat.com/v1/gfycats/fetch/status/${json_data.gfyname}`, async (err, res, body) => {
          let status = JSON.parse(body)

          if(!status.time) {
            let errmsg = JSON.parse(status.errorMessage)
            let embed = {
              title: "Error",
              description: `**Code:** \`${errmsg.code}\`\n\`${errmsg.description}\``
            }
            message.reactions.removeAll()
            message.react(failed)
            return message.channel.send({
              embeds: [embed]
            })
          } else {
            let i = 0

            function send() {
              message.reactions.removeAll()
              message.react(finished)
              message.channel.send({
                content: `Gifified in **${i} seconds**||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| https://gfycat.com/${json_data.gfyname}.gif`
              })
            }
            let interval = setInterval(function() {
              i++
              request(`https://api.gfycat.com/v1/gfycats/fetch/status/${json_data.gfyname}`, async (err, res, body) => {
                let s = JSON.parse(body)
                if(s.task == "complete") {
                  clearInterval(interval)
                  send()
                }
              })
            }, 1000)

          }

        })
      }
    })

  },
}

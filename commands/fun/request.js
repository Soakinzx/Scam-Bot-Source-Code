const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
const sourcebin = require('sourcebin');
module.exports = {
  name: "request",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$request"],
  req_perms: ["SEND_MESSAGES"],
  description: "send a request to a website",
  run: async (client, message, args) => {
    let url = args.join(" ")
    if(!url) return message.reply({
      content: "Argument Missing: `url`"
    })
    if(!functions.isValidUrl(url)) return message.reply({
      content: "Argument Invalid: `url: must be a valid url`"
    })
    
    request({
      method: 'GET',
      url: url
    }, async (err,res,body) => {
        let embed = {
            title: "Request",
            footer: {
                text: `Status ${(res && res.statusCode) ? res.statusCode : "Unknown"}`
            }
        }
        if(!res || res.statusCode !== 200) {
            if(!err) {
                embed.description = `**Could not send request to url with status code:** \`${(res && res.statusCode) ? res.statusCode : "Unknown"}\``
            } else {
                embed.description = `**Could not send request to url error (\`${err}\`) with status code:** \`${(res && res.statusCode) ? res.statusCode : "Unknown"}\``
            }
        } else {
            let src;
            try {
                src = await sourcebin.create([{content: `${body}`, language: "html"}], {title: "HTML", description: "HTML Fetched From URL"})
            } catch(err) {
                src = await sourcebin.create([{content: `${err}`, language: "text"}], {title: "Error", description: "Error Fetching HTML"})
            }
            
            embed.description = `**Successfully sent a request to url with status code:** \`${(res && res.statusCode) ? res.statusCode : "Unknown"}\`\n**HTML Fetched** - [Here](${src.url})`
        }
        return message.channel.send({embeds: [embed]})
        
    })
  }
}

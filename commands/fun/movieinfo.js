const Discord = require("discord.js")
const request = require('request');

module.exports = {
  name: "movieinfo",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "fun",
  description: "see info on a movie",
  usage: ["$movieinfo <movie name>"],
  run: async (client, message, args) => {
    if (!args[0]) return message.reply({
      content: "Argument Missing: `name: movie name`"
    })
    let url = `https://api.popcat.xyz/imdb?q=${args.join("%20")}`
    request(url, async (err,res,body) => {
      let json = JSON.parse(body)
      let embed = {}
      if(json["error"]){
        embed["title"] = "Error"
        embed["description"] = json["error"]
      } else {
        embed['title'] = json['title']

        let ratings = []
        json["ratings"].forEach(rating => {
          ratings.push(`${rating.source} : ${rating.value}`)
        })
        embed['description'] = ratings.join("\n\n")
        embed["fields"] = [
          {name: `Released`, value: `${json["released"]}`, inline: true},
          {name: `Genres`, value: `${json["genres"]}`, inline: true},
          {name: `Director`, value: `${json["director"]}`, inline: true},
          {name: `Released`, value: `${json["released"]}`, inline: true},
          {name: `Writer`, value: `${json["writer"]}`, inline: true},
          {name: `Actors`, value: `${json["actors"]}`, inline: true},
          {name: `Plot`, value: `${json["plot"]}`, inline: true},
          {name: `Languages`, value: `${json["languages"]}`, inline: true},
          {name: `Country`, value: `${json["country"]}`, inline: true},
          {name: `Box Office`, value: `${json["boxoffice"]}`, inline: true},
          {name: `Awards`, value: `${json["awards"]}`, inline: true},
          {name: `Rating`, value: `${json["rating"]}`, inline: true},
          {name: `Votes`, value: `${json["votes"]}`, inline: true},
          {name: `Type`, value: `${json["type"]}`, inline: true},
          {name: `series`, value: `${json["series"]}`, inline: true},
        ]
        embed["thumbnail"] = {
          url: json["poster"]
        }
        embed["url"] = json["imdburl"]
      }
      message.channel.send({embeds: [embed]})
    })

  },
}
/*
axios.post('https://custom-apis.soakinzx.repl.co/apis/get-instagram-post', {
      url: url,
    }).then(html => {
      let data = html.data
      if (data["error"]) {
        return message.reply({
          content: `${data["error"]}`
        })
      }
      return message.channel.send({
        content: `**Title:** ${data.title}\n**Description:** ${data.description}`,
        files: [data.url]
      })
    })
  */
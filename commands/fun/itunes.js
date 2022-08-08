const Discord = require("discord.js");

module.exports = {
  name: "itunes",
  aliases: [],
  permission: [],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  description: "search itunes for a song",
  usage: ["$itunes <song>"],
  run: async (client, message, args) => {
    if (!args.join(" ")) return message.reply({
      content: "Argument Missing: `song`"
    })
    let song = args.join("%20")
    let url = `https://api.popcat.xyz/itunes?q=${song}`
    let request = require("request")
    request(url, (err, res, body) => {
      let json = JSON.parse(body)
      let embed = {}
      if(json["error"]){
        embed["title"] = "Error"
        embed["description"] = json["error"]
      } else {
        embed["url"] = json["url"]
        embed["title"] = json["name"]
        embed["fields"] = [
          {name:"Artist", value: `${json["artist"]}`, inline: true},
          {name:"Album", value: `${json["album"]}`, inline: true},
          {name:"Release", value: `${json["release_date"]}`, inline: true},
          {name:"Price", value: `${json["price"]}`, inline: true},
          {name:"Length", value: `${json["length"]}`, inline: true},
          {name:"Genre", value: `${json["genre"]}`, inline: true}
        ]
        embed["thumbnail"] = {
          url: json["thumbnail"]
        }
      }
      message.channel.send({embeds: [embed]})
    })

  },
};
const { Random } = require("something-random-on-discord")
const random = require("something-random-on-discord").Random
const discord = require("discord.js")
let functions = require("../../functions.js")
let cheerio = require("cheerio")
let request = require("request")
module.exports = {
  name: "sofine",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$sofine <user>"],
  req_perms: ["SEND_MESSAGES"],
  description: "so fine a user",
  run: async (client, message, args) => {
    if(!client.owners.includes(message.author.id)) return message.reply({content: "Being worked on..."})
    /*
    if(!args.join(" ")) return message.reply({content: "Argument Missing: `@user`"})
    let user2 = message.mentions.users.first() || client.users.cache.get(args.join(" ")) || client.users.cache.find(u => u.username.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    
    if(!user2) return message.reply({content: "Argument Invalid: `@user`"})
    
    let url = `https://nekobot.xyz/api/imagegen?type=ship&user1=${user2.displayAvatarURL()}&user2=${message.author.displayAvatarURL()}&raw=1`
    
    request(url, async (err, res, body) => {
      if(err) return message.reply({content: `${err}`})
      let $ = cheerio.load(body)
      let msg = `Hey ${user2}! ${message.author} Thinks Your So Fine...`
      let image = $("#pk_img").attr("src")
      let name = $("#pk_name").text()
      let embed = new discord.MessageEmbed()
      .setTitle(name)
      .setImage(image)
      return message.reply({embeds: [embed]})
    })
    request(url, headers=headers, async (err, res, body) => {
      if(err) return message.reply({content: `${err}`})
      
      console.log(body)
      //let data = body
      //let image = data["message"]
     // message.channel.send({content: msg, files: [image]})
    })
    */
  }
}
const { Random } = require("something-random-on-discord")
const random = require("something-random-on-discord").Random
const discord = require("discord.js")
let functions = require("../../functions.js")
let cheerio = require("cheerio")
let request = require("request")
module.exports = {
  name: "pokefusion",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$pokefusion"],
  req_perms: ["SEND_MESSAGES"],
  description: "show a random pokefusion",
  run: async (client, message, args) => {
    let url = `https://pokemon.alexonsager.net/${Math.floor(Math.random()*(153-1)+1)}/${Math.floor(Math.random()*(153-1)+1)}`

    request(url, async (err, res, body) => {
      if(err) return message.reply({content: `${err}`})
      let $ = cheerio.load(body)
      let image = $("#pk_img").attr("src")
      let name = $("#pk_name").text()
      let embed = new discord.MessageEmbed()
      .setTitle(name)
      .setImage(image)
      return message.reply({embeds: [embed]})
    })
    
  }
}
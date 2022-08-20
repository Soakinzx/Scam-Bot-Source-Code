const request = require("request")
const cheerio = require("cheerio")
const fs = require("fs")
const Discord = require("discord.js")
module.exports = {
  name: "dict",
  category: "fun",
  aliases: ["dictionary"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "search a word on the dictonary",
  usage: ["$dict <word>"],
  run: async (client, message, args) => {
    const word = args.join(" ")
    const url = "https://www.dictionary.com/browse/"+word
    request({
    method: 'GET',
    url: url
}, (err, res, body) => {

    if (err) return;

    let $ = cheerio.load(body);

    /*fs.writeFile("test.html", body, (err) => {
      fs.chmod("test.html", 0666, (err)=>{
        
      })
    })*/
    const text = $('[value=1]').text() || "No definition found"
      const embed = new Discord.MessageEmbed()
      embed.setTitle("Dictionary")
      embed.setDescription(`**${text}**`)
      embed.setColor("DARK_BUT_NOT_BLACK")
    message.channel.send({embeds:[embed]})
});
},
}

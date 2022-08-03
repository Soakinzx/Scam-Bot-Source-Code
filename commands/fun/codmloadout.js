const { Random } = require("something-random-on-discord")
const random = require("something-random-on-discord").Random
const discord = require("discord.js")
let functions = require("../../functions.js")
let cheerio = require("cheerio")
let request = require("request")

let obj = {
  "a1": "attachment 1",
  "a2": "attachment 2",
  "a3": "attacment 3",
  "a4": "attachment 4",
  "a5": "attachment 5",
  "p1": "perk 1",
  "p2": "perk 2",
  "p3": "perk 3"
}

module.exports = {
  name: "codmloadout",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$codmloadout"],
  req_perms: ["SEND_MESSAGES"],
  description: "show a random generated codm loudout",
  run: async (client, message, args) => {
    let url = `https://Custom-Apis.soakinzx.repl.co/apis/codm-loadout-generator`
    const format = (str) => `${str[0].toUpperCase()}${str.substr(1)}`
    request(url, async (err, res, body) => {
      if(err) return message.reply({content: `${err}`})
      let json = JSON.parse(body)
      let keys = Object.keys(json)
      keys = keys.splice(0,3)
      let perks = Object.keys(json.perks)
      let embed = new discord.MessageEmbed()
      .setTitle(`Generated Loadout Loadout`)

      for(let key of keys){
        let newkeys = Object.keys(json[key])
        let name = (key == "perks") ? "Perks" : json[key][newkeys[0]]
        if(name !== "Perks"){
          newkeys.shift()
        }
        embed.addField(`${name}`, newkeys.map(k => `${obj[k]}: ${json[key][k]}`).join("\n"),true)
      }
      return message.channel.send({embeds: [embed]})
    })
    
  }
}
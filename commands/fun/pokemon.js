const { Random } = require("something-random-on-discord")
const random = require("something-random-on-discord").Random
const discord = require("discord.js")
let functions = require("../../functions.js")
let cheerio = require("cheerio")
let request = require("request")
module.exports = {
  name: "pokemon",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$pokemon"],
  req_perms: ["SEND_MESSAGES"],
  description: "show info about a pokemon",
  run: async (client, message, args) => {
    return message.reply({content: `Being worked on...`})
    
  }
}
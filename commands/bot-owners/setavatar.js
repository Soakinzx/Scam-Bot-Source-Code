const moment = require("moment")
const Discord = require("discord.js")
const {
      MessageActionRow,
      MessageButton,
      MessageEmbed
    } = require("discord.js")
const db = require("../../Models/Guild")
const functions = require("../../functions.js")
module.exports = {
  name: "setavatar",
  aliases: [],
  category: "bot-owners",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "a command for the bot owners",
  usage: ["$setavatar"],
  run: async (client, message, args) => {
    if (!client.owners.includes(message.author.id)) return;
    let attachments = message.attachments
    
    if(attachments.size == 0) return message.reply({content: `Attachment Missing`})
    let urls = []
    attachments.map(att => {
      urls.push(att.url)
    })
    let url = urls[0]
    client.user.setAvatar(url).then(() => {
      return message.reply({content: `${client.user.username}'s avatar set`})
    }).catch(err => {
      return message.reply({content: `Could not set ${client.user.usernames}'s avatar: \`${err}\``})
    })
  },
}
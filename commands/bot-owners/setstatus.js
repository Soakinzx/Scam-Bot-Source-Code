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
  name: "setstatus",
  aliases: [],
  category: "bot-owners",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "a command for the bot owners",
  usage: ["$setstatus"],
  run: async (client, message, args) => {
    if (!client.owners.includes(message.author.id)) return;
    let text = args.join(" ")
    if(!text) return message.reply({content: "Argument Missing: `text`"})
    if(text.length > 128) return message.reply({content: "Argument Invalid: `status: must be less than or equal to 128 characters`"})
    client.user.setActivity(text, {
  type: "STREAMING",
  url: "https://www.twitch.tv/boredisjustcool"
});
    
    return message.reply({content: `${client.user.username}'s status has been changed to \`${text}\``})
  },
}
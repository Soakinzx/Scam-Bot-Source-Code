const Discord = require("discord.js")
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require("discord.js");
let functions = require("../../functions.js")
let moment = require("moment")
module.exports = {
  name: "boosts",
  category: "info",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$boosts"],
  description: "see server boosts",
  run: async (client, message, args) => {
      let boosts = message.guild.premiumSubscriptionCount
      message.channel.send({embeds: [{title: "Boosts", description: `**Server Boosts:** \`${boosts}\``}]})
  },
};

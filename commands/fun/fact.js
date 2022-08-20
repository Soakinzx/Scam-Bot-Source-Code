const Discord = require("discord.js");

module.exports = {
  name: "fact",
  aliases: [],
  permission: [],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  description: "say a fact",
  usage: ["$fact <text>"],
  run: async (client, message, args) => {
    if (!args.join(" ")) return message.reply({
      content: "Argument Missing: `text`"
    })
    let text = args.join("%20")
    let url = `https://api.popcat.xyz/facts?text=${text}`
    let embed = {
      title: "Facts",
      image: {
        url: url
      }
    }
    message.channel.send({embeds: [embed]})
    

  },
};
const Discord = require("discord.js");
const figlet = require('figlet');
module.exports = {
    name: "suprisedpika",
    aliases: ["pikasuprised"],
    permission: [],
    category: "image",
    req_perms: ["SEND_MESSAGES"],
    description: "pika will be suprised!!!",
    usage: ["$pikasuprised <text>"],
    run: async (client, message, args) => {
        if (!args.join(" ")) return message.reply({
            content: "Include a message"
        })

        let embed = {
          title: "Pika Suprised :scream_cat:",
          image: {
            url: `https://api.popcat.xyz/pikachu?text=${args.join("%20")}`
          }
        }
      message.channel.send({embeds: [embed]})
      
    },
};
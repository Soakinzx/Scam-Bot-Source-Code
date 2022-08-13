const Discord = require("discord.js");
const figlet = require('figlet');
module.exports = {
    name: "achievement",
    aliases: [],
    permission: [],
    category: "fun",
    req_perms: ["SEND_MESSAGES"],
    description: "send minecraft achievement with custom text",
    usage: ["$achievement <text>"],
    run: async (client, message, args) => {
        if (!args.join(" ")) return message.reply({
            content: "Include a message"
        })
        let embed = {
            title: "Minecraft Achievement",
            image: {
                url: `https://minecraftskinstealer.com/achievement/12/Achievement%20Get!/${args.join("+")}`
            }
        }
        message.channel.send({embeds: [embed]})
    },
};

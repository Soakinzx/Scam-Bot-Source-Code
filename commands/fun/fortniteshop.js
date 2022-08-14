const Discord = require("discord.js")
module.exports = {
    name: "fortniteshop",
    aliases: [],
    category: "fun",
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    description: "see current fortniteshop",
    usage: ["$fortniteshop"],
    run: async (client, message, args) => {
        let embed = {
            title: "Fortnite Shop",
            image: {
                url: "https://ctk-api.herokuapp.com/fortnite-shop"
            }
        }
        return message.channel.send({embeds: [embed]})
    },
}

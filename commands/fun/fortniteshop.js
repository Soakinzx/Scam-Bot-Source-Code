const Discord = require("discord.js")
module.exports = {
    name: "fortniteshop",
    aliases: [],
    category: "fun",
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    description: "see current fortnite shop",
    usage: ["$fortniteshop"],
    run: async (client, message, args) => {
        message.channel.send({content: "Fortnite Shop"})
        return message.channel.send({content: "https://ctk-api.herokuapp.com/fortnite-shop"})
    },
}

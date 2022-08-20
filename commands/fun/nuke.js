const Discord = require("discord.js");
const functions = require("../../functions.js")
module.exports = {
    name: "nuke",
    aliases: [],
    permission: [],
    category: "fun",
    req_perms: ["SEND_MESSAGES"],
    description: "totally real nuke command",
    usage: ["$nuke"],
    run: async (client, message, args) => {
      let msges = [`Deleting all \`${message.guild.channels.cache.size}\` channels...`, `Kicking all \`${message.guild.members.cache.size}\` members...`, `Totally Real Nuke complete server has been obliterated`]
      message.channel.send({content: `Nuking server...`})
      let interval = setInterval(function(){
        let msg = msges[0]
        msges.shift()
        message.channel.send({content: `${msg}`})
        if(msges.length == 0) {
          return clearInterval(interval)
        }
      },2000)
    },
};
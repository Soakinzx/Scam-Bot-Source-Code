
const Discord = require("discord.js")
module.exports = {
  name: "ping",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "ping command",
  usage: ["$ping"],
  run: async (client, message, args) => {
    let startTime = Date.now()
    message.channel.send({content: `Pong!!! My ping is: \`${Date.now() - message.createdTimestamp}ms\``}).then(msg => {
      let endTime = Date.now()
      msg.edit({content: `Pong!!! My ping is: \`${Date.now() - msg.createdTimestamp}ms\`\nApi latency: \`${client.ws.ping}ms\`\nCode took \`${Math.round(endTime-startTime)}ms\` to run`})
    })
},
}

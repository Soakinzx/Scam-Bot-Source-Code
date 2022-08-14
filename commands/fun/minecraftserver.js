const request = require("request")
const functions = require("../../functions.js")
const Discord = require("discord.js")
module.exports = {
  name: "minecraftserver",
  category: "fun",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "get info on a minecraft server",
  usage: ["$minecraftserver <server ip>"],
  run: async (client, message, args) => {
    const ip = args.join(" ")
    const url = "https://mcapi.us/server/status?ip="+ip
    request({
    method: 'GET',
    url: url
}, (err, res, body) => {

    if (err) return;

    let info = JSON.parse(body)
    const text = $('[value=1]').text() || "No definition found"
    if(info.error !== null){
        return message.reply({content: `${info.error}`})
    } else {
        let embed = {
            title: `Minecraft Server Info`,
            description: `${info.motd}`,
            fields: [
                {name: `Players`, value: `${functions.text_block(`${info.players.now}/${info.players.max}`)}`, inline: true},
                {name: `Status`, value: `${functions.text_block(`${(info.online)?"Online":"Offline"}`)}`, inline: true}
            ],
            url: ip,
            thumbnail: {
                url: info.favicon
            }
    }
    message.channel.send({embeds:[embed]})
    }
});
},
}

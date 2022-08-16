const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "steam",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$steam <steam app name>"],
  req_perms: ["SEND_MESSAGES"],
  description: "get info on a steam app",
  run: async (client, message, args) => {
    if(!args.length) return message.reply({
      content: "Argument Missing: `steam app name`"
    })

    request(`https://api.popcat.xyz/steam?q=${args.join("20%")}`, async (err, res, body) => {
      if(err) return;
      let json = JSON.parse(body)
      let embed = new discord.MessageEmbed
      if(json.error) {
        embed.setTitle("Error")
        embed.setDescription(json.error)
      } else {
        embed.setColor("DARK_BUT_NOT_BLACK")
        embed.setTitle(`${json.name}`)
        embed.setThumbnail(json.banner)
        embed.setURL(json.website)
        embed.setImage(json.thumbnail)
        embed.addFields(
        {
            name: "App Info",
            value: `**Type:** \`${json.type}\`\n**Devolopers:** \`${json.devolopers.join(", ")}\`\n**Publishers:** \`${json.publishers.join(", ")}\`\n**Price:** \`${json.price}\``,
            inline: true
        })
      }
      message.channel.send({
        embeds: [embed]
      })
    })

  }
}

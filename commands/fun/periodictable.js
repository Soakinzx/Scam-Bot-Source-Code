const discord = require("discord.js")
let functions = require("../../functions.js")
const request = require("request")
module.exports = {
  name: "periodictable",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$periodictable <optional: element>"],
  req_perms: ["SEND_MESSAGES"],
  description: "periodictable",
  run: async (client, message, args) => {
    if(!args.length) {
      let image = "https://sciencenotes.org/wp-content/uploads/2017/02/KidsPeriodicTable2017.png"
      return message.channel.send({
        embeds: [{
          title: "Periodic Table",
          image: {
            url: image
          }
        }]
      })
    } else {
      request(`https://api.popcat.xyz/periodic-table?element=${args.join("20%")}`, async (err, res, body) => {
        if(err) return;
        let json = JSON.parse(body)

        let embed = {}
        if(json.error) {
          embed.title = "Error"
          embed.description = json.error
        } else {
          embed.color = "DARK_BUT_NOT_BLACK"
          embed.title = json.name
          embed.description = json.summary
          if(json.image !== "None") {
            embed.image = {
              url: json.image
            }
          }
          
          embed.fields = [{
            name: "Element Info",
            value: `**Symbole:** \`${json.symbol}\`\n**Atomic Number:** \`${json.atomic_number}\`\n**Atomic Mass:** \`${json.atomic_mass}\`\n**Period:** \`${json.period}\`\n**Phase:** \`${json.phase}\`\n**Discovered By:** \`${json.discovered_by}\``,
            inline: true
          }]
        }
        message.channel.send({
          embeds: [embed]
        })
      })
    }



  }
}

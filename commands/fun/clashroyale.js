const discord = require("discord.js")
let functions = require("../../functions.js")
const axios = require("axios")
module.exports = {
  name: "clashroyale",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$clashroyale <action>"],
  req_perms: ["SEND_MESSAGES"],
  description: "clash royale command",
  run: async (client, message, args) => {
    //if(!client.owners.includes(message.author.id)) return message.reply({content: "Being worked on..."})
    let actions = ["playerinfo", "playerwarlog", "playerbadges", "playercards", "playerdecks", "playerachievements", "upcomingchest", "claninfo", "clanmembers", "clancurrentwar", "clanwarlog", "tournamentinfo"]
    if(!args.length) return message.reply({
      content: `Argument Missing: \`action: supported actions: ${actions.join("\n")}\``
    })

    let action = args[0].toLowerCase()
    if(!actions.includes(action)) return message.reply({
      content: `Argument Invalid: \`action: supported actions: ${actions.join("\n")}\``
    })

    if(action == "playerinfo") {
      if(!args[1]) return message.reply({
        content: "Argument Missing: `player tag`"
      })
      let playertag = args[1].toUpperCase()
      if(playertag.startsWith("#")) {
        playertag = playertag.replace("#", "%")
      } else {
        playertag = "%" + playertag
      }
      axios({
          method: "get",
          url: `https://api.clashroyale.com/v1/players/${playertag}`,
          headers: {
            "Authorization": `Bearer ${client.clashroyale_api_key}`
          }
        })
        .then(res => {
          if(res.status !== 200) {
            let embed = {
              title: "Error",
              description: `**Try Again**`
            }
            return message.channel.send({
              embeds: [embed]
            })
          } else {
            let xp_perlevel = {
              1: 20,
              2: 50,
              3: 100,
              4: 200,
              5: 400,
              6: 1000,
              7: 2000,
              8: 5000,
              9: 10000,
              10: 20000,
              11: 35000,
              12: 50000,
              13: 80000,
              14: "MAX"
            }
            let data = res.data
            let embed = new discord.MessageEmbed()
              .setTitle(`${data.name}'s Clash Royale Info`)
              .setDescription(`**Player Tag:** \`${data.tag}\``)
              .addFields([{
                  name: "Stats",
                  value: `**Level:** \`${data.expLevel}\`\n**XP:** \`${data.expPoints}/${xp_perlevel[data.expLevel]}\`\n**Current Trophies:** \`${data.trophies}\`\n**Highest Trophies:** \`${data.bestTrophies}\`\n**Wins/Losses:** \`${data.wins}/${data.losses}\`\n**Battles:** \`${data.battleCount}\`\n**3 Crown Wins:** \`${data.threeCrownWins}\`\n**Challenge Cards Won:** \`${data.challengeCardsWon}\`\n**Challenge Wins:** \`${data.challengeMaxWins}\`\n**Tournament Cards Won:** \`${data.tournamentCardsWon}\`\n**Tournaments Played:** \`${data.tournamentBattleCount}\`\n**Donations:** \`${data.donations}\`\n**Donations Recieved:** \`${data.donationsReceived}\`\n**Total Donations:** \`${data.totalDonations}\`\n**War Days Won:** \`${data.warDayWins}\`\n`,
                  inline: true
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true
                },
                {
                  name: "Clan",
                  value: `**Tag:** \`${data.clan.tag}\`\n**Clan Name:** \`${data.clan.name}\`\n**Clan Badge ID:** \`${data.clan.badgeId}\`\n**Clan Cards Collected:** \`${data.clanCardsCollected}\`\n**Clan Role:** \`${data.role}\`\n`,
                  inline: true
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true
                },
                {
                  name: "League Statistics",
                  value: `**Current Season:**\n**Current Trophies:** \`${data.leagueStatistics.currentSeason.trophies}\`\n**Highest Trophies:** \`${data.leagueStatistics.currentSeason.bestTrophies}\`\n\n**Best Season:**\n**Trophies:** \`${data.leagueStatistics.bestSeason.trophies}\``,
                  inline: true
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true
                },
                {
                  name: "Arena",
                  value: `**Name:** ${data.arena.name}\n**Arena ID:** ${data.arena.id}`,
                  inline: true
                }
              ])
              .setTimestamp()

            return message.channel.send({
              embeds: [embed]
            })
          }
        })
        .catch(err => {
          if(err) {
            if(err.response.status == 400) {

              let embed = {
                title: "Error",
                description: `**Message:** Player Not Found`
              }
              return message.channel.send({
                embeds: [embed]
              })
            } else {
              let data = err.response.data
              let embed = {
                title: "Error",
                description: `**Reason:** ${data.reason}\n**Message:** ${data.message}`
              }
              return message.channel.send({
                embeds: [embed]
              })
            }
          }
        })
    } else {
        return message.reply({content: "Action being worked on..."})
    }
  }
}

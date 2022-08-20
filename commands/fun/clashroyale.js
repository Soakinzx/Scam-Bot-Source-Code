const discord = require("discord.js");
let functions = require("../../functions.js");
const axios = require("axios");
function convert(date) {
  let ms = Date.now() - date;
  let secs = Math.floor(ms / 1000);
  let mins = Math.floor(secs / 60);
  let hours = Math.floor(mins / 60);
  let days = Math.floor(hours / 24);
  secs %= 60;
  mins %= 60;
  hours %= 24;
  days %= 24;
  return `${days}d ${hours}h ${mins}m ${secs}s`;
}
function format(string) {
  let parts = string.split(" ");
  for (let i = 0; i < parts.length; i++) {
    parts[i] =
      parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase();
  }
  string = parts.join(" ");
  return string;
}
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
    let actions = [
      "playerinfo",
      "playerbattlelog",
      "playerbadges",
      "playercards",
      "playerdecks",
      "playerachievements",
      "upcomingchest",
      "claninfo",
      "clanmembers",
      "clancurrentwar",
      "clanwarlog",
      "tournamentinfo",
    ];
    if (!args.length)
      return message.reply({
        content: `Argument Missing: \`action: supported actions: ${actions.join(
          "\n"
        )}\``,
      });

    let action = args[0].toLowerCase();
    if (!actions.includes(action))
      return message.reply({
        content: `Argument Invalid: \`action: supported actions: ${actions.join(
          "\n"
        )}\``,
      });

    if (action == "playerinfo") {
      if (!args[1])
        return message.reply({
          content: "Argument Missing: `player tag`",
        });
      let playertag = args[1].toUpperCase();
      if (playertag.startsWith("#")) {
        playertag = playertag.replace("#", "%23");
      } else {
        playertag = "%23" + playertag;
      }
      axios({
        method: "get",
        url: `https://api.clashroyale.com/v1/players/${playertag}`,
        headers: {
          Authorization: `Bearer ${client.clashroyale_api_key}`,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            let embed = {
              title: "Error",
              description: `**Try Again**`,
            };
            return message.channel.send({
              embeds: [embed],
            });
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
              14: "MAX",
            };
            let data = res.data;
            let embed = new discord.MessageEmbed()
              .setTitle(`${data.name}'s Clash Royale Info`)
              .setDescription(`**Player Tag:** \`${data.tag}\``)
              .addFields([
                {
                  name: "Stats",
                  value: `**Level:** \`${data.expLevel}\`\n**XP:** \`${
                    data.expPoints
                  }/${xp_perlevel[data.expLevel]}\`\n**Current Trophies:** \`${
                    data.trophies
                  }\`\n**Highest Trophies:** \`${
                    data.bestTrophies
                  }\`\n**Wins/Losses:** \`${data.wins}/${
                    data.losses
                  }\`\n**Battles:** \`${
                    data.battleCount
                  }\`\n**3 Crown Wins:** \`${
                    data.threeCrownWins
                  }\`\n**Challenge Cards Won:** \`${
                    data.challengeCardsWon
                  }\`\n**Challenge Wins:** \`${
                    data.challengeMaxWins
                  }\`\n**Tournament Cards Won:** \`${
                    data.tournamentCardsWon
                  }\`\n**Tournaments Played:** \`${
                    data.tournamentBattleCount
                  }\`\n**Donations:** \`${
                    data.donations
                  }\`\n**Donations Recieved:** \`${
                    data.donationsReceived
                  }\`\n**Total Donations:** \`${
                    data.totalDonations
                  }\`\n**War Days Won:** \`${data.warDayWins}\`\n`,
                  inline: true,
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true,
                },
                {
                  name: "Clan",
                  value: `**Tag:** \`${data.clan.tag}\`\n**Clan Name:** \`${data.clan.name}\`\n**Clan Badge ID:** \`${data.clan.badgeId}\`\n**Clan Cards Collected:** \`${data.clanCardsCollected}\`\n**Clan Role:** \`${data.role}\`\n`,
                  inline: true,
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true,
                },
                {
                  name: "League Statistics",
                  value: `**Current Season:**\n**Current Trophies:** \`${data.leagueStatistics.currentSeason.trophies}\`\n**Highest Trophies:** \`${data.leagueStatistics.currentSeason.bestTrophies}\`\n\n**Best Season:**\n**Trophies:** \`${data.leagueStatistics.bestSeason.trophies}\``,
                  inline: true,
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true,
                },
                {
                  name: "Arena",
                  value: `**Name:** ${data.arena.name}\n**Arena ID:** ${data.arena.id}`,
                  inline: true,
                },
              ])
              .setTimestamp();

            return message.channel.send({
              embeds: [embed],
            });
          }
        })
        .catch((err) => {
          if (err) {
            if (err.response.status == 400) {
              let embed = {
                title: "Error",
                description: `**Message:** Player Not Found`,
              };
              return message.channel.send({
                embeds: [embed],
              });
            } else {
              let data = err.response.data;
              let embed = {
                title: "Error",
                description: `**Reason:** ${data.reason}\n**Message:** ${data.message}`,
              };
              return message.channel.send({
                embeds: [embed],
              });
            }
          }
        });
    } else if (action == "playerbattlelog") {
      if (!args[1])
        return message.reply({
          content: "Argument Missing: `player tag`",
        });
      let playertag = args[1].toUpperCase();
      if (playertag.startsWith("#")) {
        playertag = playertag.replace("#", "%23");
      } else {
        playertag = "%23" + playertag;
      }
      axios({
        method: "get",
        url: `https://api.clashroyale.com/v1/players/${playertag}`,
        headers: {
          Authorization: `Bearer ${client.clashroyale_api_key}`,
        },
      })
        .then(async (res) => {
          if (res.status !== 200) {
            let embed = {
              title: "Error",
              description: `**Try Again**`,
            };
            return message.channel.send({
              embeds: [embed],
            });
          } else {
            let playerdata = res.data;
            let data = await axios({
              method: "get",
              url: `https://api.clashroyale.com/v1/players/${playertag}/battlelog`,
              headers: {
                Authorization: `Bearer ${client.clashroyale_api_key}`,
              },
            });

            /*let embed = new discord.MessageEmbed()
              .setTitle(`${data.name}'s Clash Royale Info`)
              .setDescription(`**Player Tag:** \`${data.tag}\``)
            */
            if (data.length == 0)
              return message.reply({ content: "No battle logs found" });

            const backId = "back";
            const forwardId = "forward";
            const backButton = new MessageButton({
              style: "SECONDARY",
              emoji: "<:arrowleft:1001624454360744066>",
              customId: backId,
            });
            const forwardButton = new MessageButton({
              style: "SECONDARY",
              emoji: "<:arrowright:1001624452792078407>",
              customId: forwardId,
            });

            // Put the following code wherever you want to send the embed pages:
            const guild = message.guild;
            const { author, channel } = message;
            let battlelogs = data;
            /**
             * Creates an embed with battlelogs starting from an index.
             * @param {number} start The index to start from.
             * @returns {Promise<MessageEmbed>}
             */
            let amount_per_page = 1;
            const generateEmbed = async (start) => {
              const current = battlelogs.slice(
                start,
                start + amount_per_page
              )[0];

              // You can of course customise this embed however you want
              /*
              <:scambot_reply2:1007492305726484550>
              <:scambot_reply:988497454120980500>
              */
              let str = current.battleTime.split("T");
              str[1] = str[1].split(".")[0];
              str = str.splice(0, 2);
              strone = str[0].match(/.{1,2}/g);
              strone = `${strone[0]}${strone[1]}-${strone[2]}-${strone[3]}`;
              strtwo = str[1].match(/.{1,2}/g).join(":");
              str = `${strone}T${strtwo}.000Z`;
              let battleTime = str;

              let obj = {
                title: `${playerdata.name}'s Battle Log`,
                fields: [
                  {
                    name: "Battle Info",
                    value: `<:scambot_reply2:1007492305726484550>**Type:** \`${
                      current.type
                    }\`\n<:scambot_reply2:1007492305726484550>**Battle Date:** \`${convert(
                      new Date(battleTime)
                    )}\`\n<:scambot_reply2:1007492305726484550>**Gamemode:** \`${
                      current.gameMode.name
                    }\`\n<:scambot_reply2:1007492305726484550>**Arena:** \`${
                      current.arena.name
                    }\`\n<:scambot_reply2:1007492305726484550>**Deck Type:** \`${format(
                      current.deckSelectionstr.split(/(?=[A-Z])/).join(" ")
                    )}\`\n<:scambot_reply2:1007492305726484550>**Ladder Tournament?:** \`${
                      current.isLadderTournament ? "Yes" : "No"
                    }\`\n<:scambot_reply:988497454120980500>**Hosted Match?:** \`${
                      current.isHostedMatch ? "Yes" : "No"
                    }\``,
                    inline: true,
                  },
                ],
                footer: {
                  text: `Player Tag: ${playerdata.tag} ${start + 1}/${
                    battlelogs.length
                  }`,
                },
              };
              if (current.type == "challenge") {
                obj.description = `**${current.challengeTitle}**`
              }
              return obj;
            };

            // Send the embed with the first amount_per_page battlelogs
            const canFitOnOnePage = battlelogs.length <= amount_per_page;
            const embedMessage = await channel.send({
              embeds: [await generateEmbed(0)],
              components: canFitOnOnePage
                ? []
                : [
                    new MessageActionRow({
                      components: [forwardButton],
                    }),
                  ],
            });
            // Exit if there is only one page of battlelogs (no need for all of this)
            if (canFitOnOnePage) return;

            // Collect button interactions (when a user clicks a button),
            // but only when the button as clicked by the original message author
            const collector = embedMessage.createMessageComponentCollector({
              time: 60000,
              filter: ({ user }) => user.id === author.id,
            });

            let currentIndex = 0;
            collector.on("collect", async (interaction) => {
              // Increase/decrease index
              interaction.customId === backId
                ? (currentIndex -= amount_per_page)
                : (currentIndex += amount_per_page);
              // Respond to interaction by updating message with new embed
              await interaction.update({
                embeds: [await generateEmbed(currentIndex)],
                components: [
                  new MessageActionRow({
                    components: [
                      // back button if it isn't the start
                      ...(currentIndex ? [backButton] : []),
                      // forward button if it isn't the end
                      ...(currentIndex + amount_per_page < battlelogs.length
                        ? [forwardButton]
                        : []),
                    ],
                  }),
                ],
              });
            });
            collector.on("end", (c) => {
              embedMessage.edit({
                components: functions.disable_all_components(embedMessage),
              });
            });
          }
        })
        .catch((err) => {
          if (err) {
            if (err.response.status == 400) {
              let embed = {
                title: "Error",
                description: `**Message:** Player Not Found`,
              };
              return message.channel.send({
                embeds: [embed],
              });
            } else {
              let data = err.response.data;
              let embed = {
                title: "Error",
                description: `**Reason:** ${data.reason}\n**Message:** ${data.message}`,
              };
              return message.channel.send({
                embeds: [embed],
              });
            }
          }
        });
    } else {
      return message.reply({ content: "Action being worked on..." });
    }
  },
};

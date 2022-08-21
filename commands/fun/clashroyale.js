const discord = require("discord.js");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
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
  string = string.replaceAll("_", " ");
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
      "playerupcomingchest",
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
                  value: `<:scambot_reply2:1007492305726484550>**Level:** \`${
                    data.expLevel
                  }\`\n<:scambot_reply2:1007492305726484550>**XP:** \`${
                    data.expPoints
                  }/${
                    xp_perlevel[data.expLevel]
                  }\`\n<:scambot_reply2:1007492305726484550>**Current Trophies:** \`${
                    data.trophies
                  }\`\n<:scambot_reply2:1007492305726484550>**Highest Trophies:** \`${
                    data.bestTrophies
                  }\`\n<:scambot_reply2:1007492305726484550>**Wins/Losses:** \`${
                    data.wins
                  }/${
                    data.losses
                  }\`\n<:scambot_reply2:1007492305726484550>**Battles:** \`${
                    data.battleCount
                  }\`\n<:scambot_reply2:1007492305726484550>**3 Crown Wins:** \`${
                    data.threeCrownWins
                  }\`\n<:scambot_reply2:1007492305726484550>**Challenge Cards Won:** \`${
                    data.challengeCardsWon
                  }\`\n<:scambot_reply2:1007492305726484550>**Challenge Wins:** \`${
                    data.challengeMaxWins
                  }\`\n<:scambot_reply2:1007492305726484550>**Tournament Cards Won:** \`${
                    data.tournamentCardsWon
                  }\`\n<:scambot_reply2:1007492305726484550>**Tournaments Played:** \`${
                    data.tournamentBattleCount
                  }\`\n<:scambot_reply2:1007492305726484550>**Donations:** \`${
                    data.donations
                  }\`\n<:scambot_reply2:1007492305726484550>**Donations Recieved:** \`${
                    data.donationsReceived
                  }\`\n<:scambot_reply2:1007492305726484550>**Total Donations:** \`${
                    data.totalDonations
                  }\`\n<:scambot_reply:988497454120980500>**War Days Won:** \`${
                    data.warDayWins
                  }\`\n`,
                  inline: true,
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true,
                },
                {
                  name: "Clan",
                  value: `<:scambot_reply2:1007492305726484550>**Tag:** \`${data.clan.tag}\`\n<:scambot_reply2:1007492305726484550>**Clan Name:** \`${data.clan.name}\`\n<:scambot_reply2:1007492305726484550>**Clan Badge ID:** \`${data.clan.badgeId}\`\n<:scambot_reply2:1007492305726484550>**Clan Cards Collected:** \`${data.clanCardsCollected}\`\n<:scambot_reply:988497454120980500>**Clan Role:** \`${data.role}\`\n`,
                  inline: true,
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true,
                },
                {
                  name: "League Statistics",
                  value: `<:scambot_reply2:1007492305726484550>**Current Season**\n<:scambot_reply3:1010631391307899000><:scambot_reply2:1007492305726484550>**Current Trophies:** \`${data.leagueStatistics.currentSeason.trophies}\`\n<:scambot_reply3:1010631391307899000><:scambot_reply:988497454120980500>**Highest Trophies:** \`${data.leagueStatistics.currentSeason.bestTrophies}\`\n<:scambot_reply3:1010631391307899000>\n<:scambot_reply:988497454120980500>**Best Season**\n\t <:scambot_reply:988497454120980500>**Trophies:** \`${data.leagueStatistics.bestSeason.trophies}\``,
                  inline: true,
                },
                {
                  name: "‎ ",
                  value: "‎ ",
                  inline: true,
                },
                {
                  name: "Arena",
                  value: `<:scambot_reply2:1007492305726484550>**Name:** ${data.arena.name}\n<:scambot_reply:988497454120980500>**Arena ID:** ${data.arena.id}`,
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
            let res2 = await axios({
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
            if (res2.data.length == 0)
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
            let battlelogs = res2.data;
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
                    }\`\n<:scambot_reply2:1007492305726484550>**Battle Date:** \`${new Date(
                      battleTime
                    ).toLocaleDateString("en-US")}(${convert(
                      new Date(battleTime)
                    )})\`\n<:scambot_reply2:1007492305726484550>**Gamemode:** \`${current.gameMode.name
                      .replaceAll("_", "")
                      .split(/(?=[A-Z])/)
                      .join(
                        " "
                      )}\`\n<:scambot_reply2:1007492305726484550>**Arena:** \`${
                      current.arena.name
                    }\`\n<:scambot_reply2:1007492305726484550>**Deck Type:** \`${format(
                      current.deckSelection.split(/(?=[A-Z])/).join(" ")
                    )}\`\n<:scambot_reply:988497454120980500>**Ladder Tournament?:** \`${
                      current.isLadderTournament ? "Yes" : "No"
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
              let i = 0;
              current.opponent.forEach((opponent) => {
                i++;
                obj.fields.push({
                  name: `Opponent #${i}`,
                  value: `<:scambot_reply2:1007492305726484550>**Name:** \`${
                    opponent.name
                  }\`\n<:scambot_reply2:1007492305726484550>**Tag:** \`${
                    opponent.tag
                  }\`\n<:scambot_reply2:1007492305726484550>**Starting Trophies:** \`${
                    opponent.startingTrophies
                  }\`\n<:scambot_reply2:1007492305726484550>**After Trophies:** \`${
                    opponent.startingTrophies + opponent.trophyChange
                  }\`\n<:scambot_reply:988497454120980500>**Trophy Diffrence:** \`${
                    opponent.trophyChange
                  }\``,
                  inline: true,
                });
              });
              if (current.type == "challenge") {
                obj.description = `**${current.challengeTitle}**`;
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
              time: 60000 * battlelogs.length,
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
            console.log(err);
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
    } else if (action == "playerupcomingchest") {
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
      }).then(async (res) => {
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
          let res2 = await axios({
            method: "get",
            url: `https://api.clashroyale.com/v1/players/${playertag}/upcomingchests`,
            headers: {
              Authorization: `Bearer ${client.clashroyale_api_key}`,
            },
          });
          let data = res2.data;
          let i = 0;
          let embed = {
            title: `${playerdata.name}'s Upcoming Chest`,
            description: data
              .items.map((chest) => {
                i++;
                return `\`${i}\` **${chest.name}** • \`${
                  chest.index == 0 ? "Next" : `+${chest.index}`
                }\``;
              })
              .join("\n"),
          };
          return message.channel.send({ embeds: [embed] });
        }
      });
    } else {
      return message.reply({ content: "Action being worked on..." });
    }
  },
};

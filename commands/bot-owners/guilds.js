const moment = require("moment")
const Discord = require("discord.js")
const {
      MessageActionRow,
      MessageButton,
      MessageEmbed
    } = require("discord.js")
const db = require("../../Models/Guild")
const functions = require("../../functions.js")
module.exports = {
  name: "guilds",
  aliases: ["servers"],
  category: "bot-owners",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "a command for the bot owners",
  usage: ["$guilds"],
  run: async (client, message, args) => {
    if (!client.owners.includes(message.author.id)) return;

    

    // Constants

    const backId = 'back'
    const forwardId = 'forward'
    const backButton = new MessageButton({
      style: 'SECONDARY',
      emoji: '<:arrowleft:1001624454360744066>',
      customId: backId
    })
    const forwardButton = new MessageButton({
      style: 'SECONDARY',
      emoji: '<:arrowright:1001624452792078407>',
      customId: forwardId
    })

    // Put the following code wherever you want to send the embed pages:

    const {
      author,
      channel
    } = message
    const guilds = [...client.guilds.cache.values()]

    /**
     * Creates an embed with guilds starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */
    let amount_per_page = 10
    const generateEmbed = async start => {
      const current = guilds.slice(start, start + amount_per_page)

      // You can of course customise this embed however you want
      return new MessageEmbed({
        title: "Guilds",
        fields: await Promise.all(
          current.map(async guild => ({
            name: guild.name,
            value: `\`\`\`UserCount: ${guild.members.cache.size}\nID: ${guild.id}\nOwner: ${(await guild.fetchOwner()).user.tag}\`\`\``
          }))
        )
      }).setFooter(`Showing guilds ${start + 1}-${start + current.length} out of ${
      guilds.length
    }`)
    }

    // Send the embed with the first amount_per_page guilds
    const canFitOnOnePage = guilds.length <= amount_per_page
    const embedMessage = await channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ?
        [] :
        [new MessageActionRow({
          components: [forwardButton]
        })]
    })
    // Exit if there is only one page of guilds (no need for all of this)
    if (canFitOnOnePage) return

    // Collect button interactions (when a user clicks a button),
    // but only when the button as clicked by the original message author
    const collector = embedMessage.createMessageComponentCollector({
      filter: ({
        user
      }) => user.id === author.id
    })

    let currentIndex = 0
    collector.on('collect', async interaction => {
      // Increase/decrease index
      interaction.customId === backId ? (currentIndex -= amount_per_page) : (currentIndex += amount_per_page)
      // Respond to interaction by updating message with new embed
      await interaction.update({
        embeds: [await generateEmbed(currentIndex)],
        components: [
          new MessageActionRow({
            components: [
              // back button if it isn't the start
              ...(currentIndex ? [backButton] : []),
              // forward button if it isn't the end
              ...(currentIndex + amount_per_page < guilds.length ? [forwardButton] : [])
            ]
          })
        ]
      })
    })
  },
}
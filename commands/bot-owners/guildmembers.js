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
  name: "guildmembers",
  aliases: ["servermembers"],
  category: "bot-owners",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "a command for the bot owners",
  usage: ["$servermembers <server name/id>"],
  run: async (client, message, args) => {
    if (!client.owners.includes(message.author.id)) return;
    
    let guild = client.guilds.cache.get(args.join(" ")) || client.guilds.cache.find(g => g.name.toLowerCase() == args.join(" ").toLowerCase()) || message.guild
    

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
    const members = guild.members.cache.map(m => m)

    /**
     * Creates an embed with members starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */
    let amount_per_page = 20
    const generateEmbed = async start => {
      const current = members.slice(start, start + amount_per_page)

      // You can of course customise this embed however you want
      return new MessageEmbed({
        title: "members",
        fields: await Promise.all(
          current.map(async member => ({
            name: member.user.tag,
            value: `\`\`\`Username: ${member.user.username}\nID: ${member.id}\nBot: ${member.user.bot}\`\`\``
          }))
        )
      }).setFooter(`Showing members ${start + 1}-${start + current.length} out of ${
      members.length
    }`)
    }

    // Send the embed with the first amount_per_page members
    const canFitOnOnePage = members.length <= amount_per_page
    const embedMessage = await channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ?
        [] :
        [new MessageActionRow({
          components: [forwardButton]
        })]
    })
    // Exit if there is only one page of members (no need for all of this)
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
              ...(currentIndex + amount_per_page < members.length ? [forwardButton] : [])
            ]
          })
        ]
      })
    })
  },
}
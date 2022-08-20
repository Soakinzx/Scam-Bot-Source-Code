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
  name: "bans",
  aliases: [],
  category: "info",
  permission: ["BAN_MEMBERS"],
  req_perms: ["SEND_MESSAGES"],
  description: "shows all bans in the server",
  usage: ["$bans"],
  run: async (client, message, args) => {
    
    let guild = message.guild
    

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
    const members = []
    await guild.bans.fetch().then(async (bans) => {
      let keys = Array.from(bans.keys())
    
      for(let key of keys){
        await guild.bans.fetch(key).then(ban => {
          members.push({user: ban.user, reason: ((ban.reason == null) ? "No reason given." : ban.reason)})
        })
        
      }
    })
    
    if(members.length == 0) return message.reply({content: `No Bans`})
    /**
     * Creates an embed with members starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */
    let amount_per_page = 10
    const generateEmbed = async start => {
      const current = members.slice(start, start + amount_per_page)

      // You can of course customise this embed however you want
      return new MessageEmbed({
        title: "Bans",
        fields: await Promise.all(
          current.map(async ban => ({
            name: ban.user.tag,
            value: `\`\`\`Username: ${ban.user.username}\nID: ${ban.user.id}\nBot: ${ban.user.bot}\nReason: ${ban.reason}\`\`\``
          }))
        )
      }).setFooter(`Showing bans ${start + 1}-${start + current.length} out of ${
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
      time: 60000,
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
    collector.on("end", c => {
      embedMessage.edit({components: functions.disable_all_components(embedMessage)})
    })
  },
}

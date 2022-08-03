function format(string) {
  let parts = string.split(" ")
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase()
  }
  string = parts.join(" ")
  return string
}
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
let discord = require("discord.js")
let functions = require("../../functions.js")
let gdb = require("../../Models/Guild")
module.exports = {
  name: "tutorial",
  aliases: ["tut"],
  category: "info",
  req_perms: [],
  permission: [],
  usage: ["$tutorial"],
  description: "see a tutorial for configuration setups",
  run: async (client, message, args) => {
    
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
    
    let config = require("../../json/config.json")
    let data = await functions.getdb(gdb, {_id: message.guild.id})
    let prefix;
    if(!data || data.prefix == null) {
      prefix = "$"
    } else {
      prefix = data.prefix
    }
    let keys = Object.keys(config.tutorials)
    const tutorials = []
    keys.map(key => {
      tutorials.push(config.tutorials[key])
    })

    /**
     * Creates an embed with tutorials starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */
    let amount_per_page = 1
    
    const generateEmbed = async start => {
      const current = tutorials.slice(start, start+amount_per_page)[0]

      // You can of course customise this embed however you want
      return new MessageEmbed({
        title: current.topic,
        description: current.description.replaceAll("$", prefix)
      }).setFooter(`Page ${start + 1}/${
      tutorials.length
    }`)
    }

    // Send the embed with the first amount_per_page tutorials
    const canFitOnOnePage = tutorials.length <= amount_per_page
    const embedMessage = await channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ?
        [] :
        [new MessageActionRow({
          components: [forwardButton]
        })]
    })
    // Exit if there is only one page of tutorials (no need for all of this)
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
              ...(currentIndex + amount_per_page < tutorials.length ? [forwardButton] : [])
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
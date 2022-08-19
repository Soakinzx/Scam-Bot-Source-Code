const moment = require("moment")
const Discord = require("discord.js")
const {
      MessageActionRow,
      MessageButton,
      MessageEmbed
    } = require("discord.js")
function convert(date) {
  let ms = (Date.now() - date)
  let secs = Math.floor(ms / 1000)
  let mins = Math.floor(secs / 60)
  let hours = Math.floor(mins / 60)
  let days = Math.floor(hours / 24)
  secs %= 60;
  mins %= 60;
  hours %= 24;
  return `${days}d ${hours}h ${mins}m ${secs}s`
}

function format(string) {
  
  let parts = string.split(" ")
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase()
  }
  string = parts.join(" ")
  return string
}
const functions = require("../../functions.js")
module.exports = {
  name: "servertemplates",
  aliases: ["st", "servertemps"],
  category: "info",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  description: "shows all server templates",
  usage: ["$servertemplates"],
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
    const templates = []
    await guild.fetchTemplates().then(async (temps) => {
      temps.map(temp => {
        templates.push({code: temp.code, name: temp.name, description: temp.description, usage: temp.usageCount, created: `${temp.createdAt.toLocaleDateString("en-US")}(${convert(temp.createdAt)})`, updated: `${temp.updatedAt.toLocaleDateString("en-US")}(${convert(temp.updatedAt)})`, creator: (((client.users.cache.get(temp.creatorId))?client.users.cache.get(temp.creatorId).tag:null) || "Unknown") })
      })
    })
    
    if(templates.length == 0) return message.reply({content: `No Server Templates`})
    /**
     * Creates an embed with templates starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */
    let amount_per_page = 10
    const generateEmbed = async start => {
      const current = templates.slice(start, start + amount_per_page)

      // You can of course customise this embed however you want
      return new MessageEmbed({
        title: "Server Templates",
        fields: await Promise.all(
          current.map(async t => ({
            name: t.name,
            value: `\`\`\`Created By: ${t.creator}\nDescription: ${t.description}\nCreated At: ${t.created}\nUpdated At: ${t.updated}\nCode: ${t.code}\`\`\``
          }))
        )
      }).setFooter(`Showing server templates ${start + 1}-${start + current.length} out of ${
      templates.length
    }`)
    }

    // Send the embed with the first amount_per_page templates
    const canFitOnOnePage = templates.length <= amount_per_page
    const embedMessage = await channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ?
        [] :
        [new MessageActionRow({
          components: [forwardButton]
        })]
    })
    // Exit if there is only one page of templates (no need for all of this)
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
              ...(currentIndex + amount_per_page < templates.length ? [forwardButton] : [])
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

const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
let discord = require("discord.js")
const client = require("../../index.js");


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
let functions = require("../../functions.js")
module.exports = {
  name: "inrole",
  aliases: ["ir"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$inrole <role>"],
  category: "info",
  description: "fetches all users in a role",
  run: async (client, message, args) => {

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(r => r.name.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.member.roles.highest

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
    const members = role.members.map(m => m)
    if(members.length == 0) return message.reply({content: `No Members In \`${role.name}\``})
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
        title: `Members in ${role.name}`,
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
      components: canFitOnOnePage ? [] : [new MessageActionRow({
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
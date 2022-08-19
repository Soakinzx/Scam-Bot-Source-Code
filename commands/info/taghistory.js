const Discord = require("discord.js")
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require("discord.js");
let functions = require("../../functions.js")
let moment = require("moment")
module.exports = {
  name: "taghistory",
  category: "info",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$taghistory <optional: user>"],
  description: "see a users tag history",
  run: async (client, message, args) => {
    let u = message.author.id
    if(args[0]) {
      u = args.join(" ")
    }
    let member = message.mentions.members.first() || message.guild.members.cache.get(u) || message.guild.members.cache.find(m => m.user.username.startsWith(u.toLowerCase())) || message.guild.members.cache.find(m => m.user.tag.startsWith(u.toLowerCase())) || message.author
    if(!member) return message.reply({content: "Argument Invalid: `@user`"})
    let data = client.userdb.get(member.id)
    if(!data || data.tag_history.length == 0) return message.reply({
      content: `No Tag History Found`
    })
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
    const tags = data.tag_history

    /**
     * Creates an embed with tags starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */
    let amount_per_page = 10
    const generateEmbed = async start => {
      const current = tags.slice(start, start + amount_per_page)

      // You can of course customise this embed however you want
      return new MessageEmbed({
          title: `${member.user.tag}'s Tag History`,
          description: current.map(d => {
              return `\`${tags.indexOf(d)+1}\` \`${d.old_tag}\` -> \`${d.new_tag}\` • <t:${Math.round(d.date/1000)}:R>`
            })
            .join("\n")
        })
        .setFooter(`Showing name history tags ${start + 1}-${start + current.length} out of ${
      tags.length
    }`)
    }

    // Send the embed with the first amount_per_page tags
    const canFitOnOnePage = tags.length <= amount_per_page
    const embedMessage = await channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ? [] : [new MessageActionRow({
        components: [forwardButton]
      })]
    })
    // Exit if there is only one page of tags (no need for all of this)
    if(canFitOnOnePage) return

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
              ...(currentIndex + amount_per_page < tags.length ? [forwardButton] : [])
            ]
          })
        ]
      })
    })
    collector.on("end", c => {
      embedMessage.edit({
        components: functions.disable_all_components(embedMessage)
      })
    })



  },
};
/*
.addField("Logs Channel", `\`\`\`${logs_channel}\`\`\``, true)
*/

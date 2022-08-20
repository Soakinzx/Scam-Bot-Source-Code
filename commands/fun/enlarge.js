const discord = require("discord.js");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js")
let functions = require("../../functions.js")
module.exports = {
  name: "enlarge",
  description: "enlarge an emoji/sticker",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "fun",
  usage: ["$enlarge <optional: sticker/emoji>"],
  aliases: [],
  run: async (client, message, args) => {

    if (!args.length) {
      let urls = []
      let msges = await message.channel.messages.fetch({
        limit: 100
      })
      msges.forEach(msg => {
        for (const re of msg.content.split(" ")) {
          const pe = discord.Util.parseEmoji(re)

          if (pe && pe.id) {
            const extenstion = pe.animated ? ".gif" : ".png"
            const url = `https://cdn.discordapp.com/emojis/${pe.id + extenstion}`
            urls.push({
              url: url,
              name: pe.name,
              type: "Emoji",
              id: pe.id
            })
          }
        }
        msg.stickers.forEach(sticker => {
          urls.push({
            url: sticker.url,
            name: sticker.name,
            type: "Sticker",
            id: sticker.id
          })
        })
      })


      if (urls.length == 0) return message.reply({
        content: "No Valid Stickers/Emojis Found Within The Last 100 Messages"
      })
      
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
      let amount_per_page = 1

      const generateEmbed = async start => {
        const current = urls.slice(start, start + amount_per_page)[0]

        // You can of course customise this embed however you want
        return new MessageEmbed({
          description: `**Name:** \`${current.name}\`\n**ID:** \`${current.id}\`\n**Type:** \`${current.type}\``,
          image: {
            url: current.url
          },
          footer: {
            text: `Page ${start+1}/${urls.length}`,
            iconURL: message.author.displayAvatarURL()
          }
        })
      }

      // Send the embed with the first amount_per_page urls
      const canFitOnOnePage = urls.length <= amount_per_page
      const embedMessage = await message.channel.send({
        embeds: [await generateEmbed(0)],
        components: canFitOnOnePage ? [] : [new MessageActionRow({
          components: [forwardButton]
        })]
      })
      // Exit if there is only one page of urls (no need for all of this)
      if (canFitOnOnePage) return

      // Collect button interactions (when a user clicks a button),
      // but only when the button as clicked by the original message author
      let num = (urls.length > 10) ? parseInt((''+urls.length)[0]) : 1
      
      const collector = embedMessage.createMessageComponentCollector({
        time: num*60000,
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
                ...(currentIndex + amount_per_page < urls.length ? [forwardButton] : [])
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
    } else {
      let urls = []
      for (const re of args) {
        const pe = discord.Util.parseEmoji(re)

        if (pe.id) {
          const extenstion = pe.animated ? ".gif" : ".png"
          const url = `https://cdn.discordapp.com/emojis/${pe.id + extenstion}`
          urls.push({
            url: url,
            name: pe.name,
            type: "Emoji",
            id: pe.id
          })
        }
      }
      message.stickers.forEach(sticker => {
        urls.push({
          url: sticker.url,
          name: sticker.name,
          type: "Sticker",
          id: sticker.id
        })
      })

      if (urls.length == 0) return message.reply({
        content: "No Valid Stickers/Emojis Specified To Enlarge"
      })
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

      let amount_per_page = 1

      const generateEmbed = async start => {
        const current = urls.slice(start, start + amount_per_page)[0]

        // You can of course customise this embed however you want
        return new MessageEmbed({
          description: `**Name:** \`${current.name}\`\n**ID:** \`${current.id}\`\n**Type:** \`${current.type}\``,
          image: {
            url: current.url
          },
          footer: {
            text: `Page ${start+1}/${urls.length}`,
            iconURL: message.author.displayAvatarURL()
          }
        })
      }

      // Send the embed with the first amount_per_page urls
      const canFitOnOnePage = urls.length <= amount_per_page
      const embedMessage = await channel.send({
        embeds: [await generateEmbed(0)],
        components: canFitOnOnePage ? [] : [new MessageActionRow({
          components: [forwardButton]
        })]
      })
      // Exit if there is only one page of urls (no need for all of this)
      if (canFitOnOnePage) return

      // Collect button interactions (when a user clicks a button),
      // but only when the button as clicked by the original message author
      let num = (urls.length > 10) ? parseInt((''+urls.length)[0]) : 1
      const collector = embedMessage.createMessageComponentCollector({
        time: num*60000,
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
                ...(currentIndex + amount_per_page < urls.length ? [forwardButton] : [])
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
    }


  }
};
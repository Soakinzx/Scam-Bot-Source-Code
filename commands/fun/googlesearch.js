//key AIzaSyBpqypqA1YydcjoIcFSwRjV7oNOmEkPfL4
const discord = require("discord.js")
let functions = require("../../functions.js")
const superagent = require("superagent")
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed
} = require("discord.js")
module.exports = {
  name: "googlesearch",
  aliases: [],
  category: "fun",
  permission: [],
  usage: ["$googlesearch <search query>"],
  req_perms: ["SEND_MESSAGES"],
  description: "search google",
  run: async (client, message, args) => {
    let query = args.join(" ")
    if (!query) return message.reply({
      content: "Argument Missing: `search query`"
    })
    let result = await superagent.get("https://customsearch.googleapis.com/customsearch/v1").query({
      q: query,
      cx: "44e3102f058d06feb",
      key: "AIzaSyBpqypqA1YydcjoIcFSwRjV7oNOmEkPfL4"
    })

    if (!result.body.items) return message.reply({
      content: "Searched far and wide just to find nothing"
    })
    if (result.status >= 400) return message.reply({
      content: "An error occured, please try again"
    })
    let queries = []

    for (let i = 0; i < 10; i++) {
      let res = result.body.items
      queries = queries.concat(res)
    }
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
    let amount_per_page = 1
    const generateEmbed = async start => {
      const current = queries.slice(start, start + amount_per_page)[0]

      // You can of course customise this embed however you want
      let img;
      if(current.pagemap["cse_image"]){
        img = current.pagemap.cse_image[0].src
      } else if(current.pagemap["cse_thumbnail"]){
          img = current.pagemap.cse_thumbnail[0].src
      } else {
          img = "https://bitsofco.de/content/images/2018/12/broken-1.png"
      }
        
      return new MessageEmbed({
        title: `${current.title}`,
        description: `${current.snippet}`,
        url: `${current.link}`,
        image: {
          url: img
        }
      }).setFooter(`Showing queries ${start + 1}/${queries.length}`)
    }

    // Send the embed with the first amount_per_page queries
    const canFitOnOnePage = queries.length <= amount_per_page
    const embedMessage = await channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ? [] : [new MessageActionRow({
        components: [forwardButton]
      })]
    })
    // Exit if there is only one page of queries (no need for all of this)
    if (canFitOnOnePage) return

    // Collect button interactions (when a user clicks a button),
    // but only when the button as clicked by the original message author
    const collector = embedMessage.createMessageComponentCollector({
      time: 60000*10,
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
              ...(currentIndex + amount_per_page < queries.length ? [forwardButton] : [])
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

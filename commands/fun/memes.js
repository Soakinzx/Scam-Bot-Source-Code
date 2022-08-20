const Discord = require("discord.js")
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed
} = require("discord.js")
const functions = require("../../functions.js")
module.exports = {
  name: "memes",
  aliases: [],
  category: "fun",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  description: "shows 100 or less found memes",
  usage: ["$memes"],
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

    async function start() {
      let amount_per_page = 1
      const generateEmbed = async start => {
        const current = memes.slice(start, start + amount_per_page)[0]

        // You can of course customise this embed however you want
        return new MessageEmbed({
          title: `${current.title}`,
          image: {
            url: current.image
          }
        }).setFooter(`👍${current.upvotes} 💬${current.comments} | Showing memes ${start + 1}/10`)
      }

      // Send the embed with the first amount_per_page memes
      const canFitOnOnePage = memes.length <= amount_per_page
      const embedMessage = await channel.send({
        embeds: [await generateEmbed(0)],
        components: canFitOnOnePage ? [] : [new MessageActionRow({
          components: [forwardButton]
        })]
      })
      // Exit if there is only one page of memes (no need for all of this)
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
                ...(currentIndex + amount_per_page < memes.length ? [forwardButton] : [])
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

    let request = require("request")
    const memes = []
    var i = 1; //  set your counter to 1
    
    function loop() { //  create a loop function
      setTimeout(function() {
        
        request("https://api.popcat.xyz/meme", async (err, res, body) => {
            memes.push(JSON.parse(body))
          })
        i++;
        //  increment the counter
        if (i < 11) { //  if the counter < 10, call the loop function
          loop(); //  ..  again which will trigger another 
        } else {
          start()
        } //  ..  setTimeout()
      }, 500)
    }

    loop();


    /**
     * Creates an embed with memes starting from an index.
     * @param {number} start The index to start from.
     * @returns {Promise<MessageEmbed>}
     */

  },
}
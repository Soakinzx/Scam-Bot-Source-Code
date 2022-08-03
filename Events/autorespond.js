const client = require("../index.js")
const Discord = require("discord.js")
const db = require("../Models/Guild");
const {
  Client,
  Intents,
  MessageEmbed,
  Collection,
  MessageButton,
  MessageActionRow,
  ButtonInteraction,
  MessageAttachment,
} = require("discord.js");
let gdb = require("../Models/Guild")

function format(data, member) {
  let content = data.replace("{user}", member).replace("{member}", member).replace("{tag}", member.user.tag).replace("{server}", member.guild.name).replace("{guild}", member.guild.name).replace("{username}", member.user.username).replace("{servername}", member.guild.name).replace("{guildname}", member.guild.name)
  return content
}
module.exports = {
  name: "messageCreate",
  once: false,
  async execute(msg) {
    if(!msg.guild) return
    let prefix;
    let guild_data = await gdb.findOne({
      _id: msg.guild.id
    })
    if (!guild_data || guild_data.prefix == null) {
      prefix = "$"
    } else {
      prefix = guild_data.prefix
    }
    if (!msg.guild || msg.author.bot || msg.content.startsWith(prefix)) return
    db.findOne({
      _id: msg.guild.id
    }, async (err, data) => {
      if (err) throw err;
      if (!data) return;
      if (data) {
        if (data.Autorespond_messages.length >= 1) {
          for (const e of data.Autorespond_messages) {
            if (msg.content.toLowerCase().split(" ")[0] == e.trigger.toLowerCase()) {
              let row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("custom_autoresponse").setLabel("Custom Auto Response").setStyle("SECONDARY").setDisabled(true))
              return msg.reply({
                content: `${format(e.response, msg.member)}`,
                components: [row]
              })
            }
          }


        }
      }

    })

  },
};
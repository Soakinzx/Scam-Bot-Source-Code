const client = require("../index.js")
const Discord = require("discord.js")
const functions = require("../functions.js")
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
module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (!message.guild || !message.member) return;
    let gdata = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    let owner = functions.getowner(message.guild)
    if (!gdata || message.member.roles.cache.has(gdata.whitelistrole) || gdata.antilink == false || gdata.whitelisted.includes(message.author.id) || message.member.id == owner.id || message.member.roles.cache.has(gdata.trustrole) || gdata.trusted.includes(message.author.id)) return;

    if (message.member.id == client.user.id) return;
    if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
      try {
        return functions.sendbotlogs(message.guild, {
          title: `Anti-Link`,
          description: `Im Missing Permissions: \`MANAGE_MESSAGES\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }
    if (!message.guild.me.permissions.has("MODERATE_MEMBERS")) {
      try {
        return functions.sendbotlogs(message.guild, {
          title: `Anti-Link`,
          description: `Im Missing Permissions: \`MODERATE_MEMBERS\`\nTrying To Timeout A User: ${message.author.tag}`,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }

    if (message.content.toLowerCase().includes("tenor.com") && message.content.toLowerCase().includes(".gif") || message.content.toLowerCase().includes("-gif") || message.content.toLowerCase().includes("+gif")) return
    if (message.content.toLowerCase().includes("giphy.com") && message.content.toLowerCase().includes(".gif") || message.content.toLowerCase().includes("-gif") || message.content.toLowerCase().includes("+gif")) return

    if (message.content.toLowerCase().includes("https://") || message.content.toLowerCase().includes("http://") || message.content.toLowerCase().includes("www.") || message.content.toLowerCase().includes("discord.gg/")) {
      message.delete().catch(err => {
        return functions.sendbotlogs(message.guild, {
          title: `Anti-Link`,
          description: `${err}\nTrying To Delete Message That Includes A Link: ${message.content}`,
          color: "DARK_BUT_NOT_BLACK"
        })
      })
      message.member.timeout(5 * 60000, `Antilink Enabled`).catch(err => {
        return functions.sendbotlogs(message.guild, {
          title: `Anti-Link`,
          description: `${err}\nTrying To Timeout A User: ${message.author.tag}`,
          color: "DARK_BUT_NOT_BLACK"
        })
      })
    }
  },
};
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
let urdb = require("../Models/UserRoles")
module.exports = {
    name: "guildDelete",
    once: false,
    async execute(guild) {
      let data = await functions.getdb(gdb, {
        _id: guild.id
      })
      if (!data) return
      try {
        await gdb.findOneAndDelete({_id: guild.id}).catch(err => {
          return
        })
      } catch(err) {
        return
      }
    },
};
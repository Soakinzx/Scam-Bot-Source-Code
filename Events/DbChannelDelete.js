const Discord = require("discord.js")
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
const db = require("../Models/UserVoice");
const gdb = require("../Models/Guild")
const functions = require("../functions.js")
const client = require("../index.js")

module.exports = {
    name: "channelDelete",
    once: false,
    async execute(channel) {
      let data = await functions.getdb(db, {_gid: channel.guild.id, _cid: channel.id})
      if(!data) return;
      try{
        await db.findOneAndDelete({_gid: channel.guild.id, _cid: channel.id}).catch(err => {
          return
        })
      } catch(err){
        return
      }

      
    },
};
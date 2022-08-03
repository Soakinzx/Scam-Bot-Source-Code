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
    name: "messageDelete",
    once: false,
    async execute(msg) {
      if(!msg || !msg.content || !msg.author || msg.author.bot) return;
      let gs = functions.cloneobj(client.guild_schema)
      let data = await functions.getdb(gdb, {_id: msg.guild.id})
      if(!data) {
        let context = (msg.type == "REPLY") ? `${msg.content.slice(0,4000)} - replied to ${msg.mentions.users.first().tag}` : msg.content.slice(0,4000)
        gs.sniped_message.id = msg.author.id
        gs.sniped_message.content = context
        gs._id = msg.guild.id
        data = new gdb(gs)
        data.save()
      } else if(data) {
        
        let context = (msg.type == "REPLY") ? `${msg.content.slice(0,4000)} - replied to ${msg.mentions.users.first().tag}` : msg.content.slice(0,4000)
        let obj = {
          id: msg.author.id,
          content: context
        }
        data.sniped_message = obj
        data.save()
      }
      
    },
};
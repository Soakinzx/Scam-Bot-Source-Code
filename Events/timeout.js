const client = require("../index.js")
const Discord = require("discord.js")
const db = require("../Models/Guild");
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
    name: "guildMemberUpdate",
    once: false,
    async execute(member) {
      let data = await functions.getdb(gdb, {_id: member.guild.id})
      if(!data || data.toggletimeout_list.length == 0) return
      if(data.toggletimeout_list.includes(member.id)){
        try{
          member.timeout(0, `Untimedout by ${client.user.username} because of toggle timeout`).catch(err => {return})
        } catch(err){
          return functions.sendbotlogs(member.guild, {title: "Untimeout Toggle", description: `${err}\nTrying To Untimeout ${member.user.tag}`})
        }
      }
    },
};
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
    name: "guildMemberRemove",
    once: false,
    async execute(member) {
      let data = await functions.getdb(gdb, {
        _id: member.guild.id
      })
      if (!data) return;
      if(data.toggletimeout_list.includes(member.id)){
        data.toggletimeout_list.splice(data.toggletimeout_list.indexOf(member.id), 1)
      }
      if(data.afk_list.find(afk => afk.id == member.id)){
        let d = data.afk_list.find(afk => afk.id == member.id)
        data.afk_list.splice(data.afk_list.indexOf(d),1)
      }
      if(data.blacklisted.includes(member.id)) {
        data.blacklisted.splice(data.blacklisted.indexOf(member.id),1)
      }
      if(data.whitelisted.includes(member.id)) {
        data.whitelisted.splice(data.whitelisted.indexOf(member.id),1)
      }
      if(data.trusted.includes(member.id)) {
        data.trusted.splice(data.trusted.indexOf(member.id),1)
      }
      if(data.boosters_lost.find(d => d.id == member.id)){
          data.boosters_lost.splice(data.boosters_lost.find(d => d.id == member.id),1)
      }
      data.save()
    },
};

const db = require("../Models/Guild")
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
const moment = require("moment")
module.exports = {
  name: "messageCreate",
  once: false,
  async execute(msg) {
    if(!msg.guild || msg.author.bot || !msg.member) return;
    const mentions = msg.mentions.members
    let data = await db.findOne({
      _id: msg.guild.id
    })
    if(!data || data.afk_list.length == 0) return
    if(mentions.size > 0) {
      mentions.forEach(member => {
        let i = data.afk_list.find(afk_user => afk_user.id == member.id)
        if(i) {
          let embed = new Discord.MessageEmbed()
            .setTitle("AFK")
            .setDescription(`**${member} is currently AFK:** ${i.message}`)
            .setFooter(moment(i.date)
              .fromNow())
            .setColor("DARK_BUT_NOT_BLACK")
          msg.reply({
            embeds: [embed]
          })
        }
      })
    }
    for(const i of data.afk_list) {
      if(i.id == msg.member.id) {
        data.afk_list.splice(data.afk_list.indexOf(i),1)
        data.save()
        let embed = new Discord.MessageEmbed()
          .setTitle("AFK REMOVED")
          .setDescription(`${msg.author} Successfully removed your afk status!`)
          .setColor("DARK_BUT_NOT_BLACK")
          .setTimestamp()
        try {
          msg.member.setNickname(msg.member.nickname.replace("[AFK]", ""))
            .catch(err => {
              let i=0
            })
        } catch (err) {
          let i=0
        }
        msg.reply({
          embeds: [embed]
        })
      }
    }

  },
};

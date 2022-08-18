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
    if(mentions.size >= 1) {
      for(const member of mentions) {
        if(data.afk_list.find(afk_user => afk_user.id == member.id)) {
          let embed = new Discord.MessageEmbed()
            .setTitle("AFK")
            .setDescription(`**${messageMember} is currently AFK:** ${i.message}`)
            .setFooter(moment(i.date)
              .fromNow())
            .setColor("DARK_BUT_NOT_BLACK")
          msg.reply({
            embeds: [embed]
          })
        }
      }
    }
    let check = data.afk_list.find(afk_user => afk_user.id == msg.author.id)
    if(check) {
      data.afk_list.splice(data.afk_list.indexOf(check), 1)
      data.save()
      let embed = new Discord.MessageEmbed()
        .setTitle("AFK REMOVED")
        .setDescription(`${msg.author} Successfully removed your afk status!`)
        .setColor("DARK_BUT_NOT_BLACK")
        .setTimestamp()
      try {
        msg.member.setNickname(msg.member.nickname.replace("[AFK]", ""))
          .catch(err => {
            return
          })
      } catch (err) {
        return;
      }
      msg.reply({
        embeds: [embed]
      })
    }


  },
};

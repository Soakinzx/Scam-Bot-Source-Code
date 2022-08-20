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
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    function find_channel(id) {
      if (!member.guild.channels.cache.get(id)) return false
      return member.guild.channels.cache.get(id)
    }
    let guild = member.guild

    function formatcount(num) {
      let th_arr = ["0", "1", "4", "5", "6", "7", "8", "9"]
      //ends with 0,4,5,6,7,8,9: th
      //ends with 1: st, if is greater than 100 and ends with 1 :th
      let strnum = '' + num
      if (num > 99 || th_arr.includes(strnum[strnum.length - 1]) && strnum !== "1") {
        return strnum + "th"
      } else if (strnum == "1") {
        return strnum + "st"
      } else if (strnum == "2") {
        return strnum + "nd"
      } else if (strnum == "3") {
        return strnum + "rd"
      }
    }

    function format(data) {

      if (typeof data == 'object') {

        if (data.description) {
          data.description = format(data.description)
        }
        if (data.image && data.image.url !== null) {
          data.image.url = format(data.image.url)
        }
        if (data.thumbnail && data.thumbnail.url !== null) {
          data.thumbnail.url = format(data.thumbnail.url)
        }
        if (data.title) {
          data.title = format(data.title)
        }
        if (data.footer && data.footer.text !== null || data.footer.iconURL !== null) {

          if (data.footer.text !== null) {
            data.footer.text = format(data.footer.text)
          }
          if (data.footer.iconURL !== null) {
            data.footer.iconURL = format(data.footer.iconURL)
          }
          data.footer = data.footer
        }
        if (data.author && data.author.name !== null || data.author.iconURL !== null) {

          if (data.author.name !== null) {
            data.author.name = format(data.author.name)
          }
          if (data.author.iconURL !== null) {
            data.author.iconURL = format(data.author.iconURL)
          }
          data.author = data.author
        }
        if(data.thumbnail && data.thumbnail.url && !data.thumbnail.url.startsWith("https") && !data.thumbnail.url.startsWith("http")){
            data.thumbnail.url = "https://"+data.thumbnail.url
        }
        if(data.image && data.image.url && !data.image.url.startsWith("https") && !data.image.url.startsWith("http")){
            data.image.url = "https://"+data.image.url
        }
        return data
      } else if (typeof data == 'string') {
        let content = data.replaceAll("{member.tag}", member.user.tag).replaceAll("{member.name}", member.user.username).replaceAll("{member.username}", member.user.username).replaceAll("{tag}", member.user.tag).replaceAll("{member.tag}", member.user.tag).replaceAll("{member.id}", member.id).replaceAll("{member.avatar}", member.displayAvatarURL()).replaceAll("{member.mention}", member).replaceAll("{member.animatedavatar}", member.displayAvatarURL({
          dynamic: true
        })).replaceAll("{member.avatarurl}", member.displayAvatarURL({
          dynamic: true
        })).replaceAll("{user.tag}", member.user.tag).replaceAll("{user.id}", member.id).replaceAll("{user.name}", member.user.username).replaceAll("{user.username}", member.user.username).replaceAll("{tag}", member.user.tag).replaceAll("{user.tag}", member.user.tag).replaceAll("{user.avatar}", member.displayAvatarURL()).replaceAll("{user.mention}", member).replaceAll("{user.animatedavatar}", member.displayAvatarURL({
          dynamic: true
        })).replaceAll("{user.avatarurl}", member.displayAvatarURL({
          dynamic: true
        })).replaceAll("{server.name}", guild.name).replaceAll("{server.icon}", guild.iconURL()).replaceAll("{server.animatedicon}", guild.iconURL({
          dynamic: true
        })).replaceAll("{server.iconurl}", guild.iconURL()).replaceAll("{server.membercount}", guild.members.cache.size).replaceAll("{server.membercountformatted}", formatcount(guild.members.cache.size)).replaceAll("{server.owner}", guild.members.cache.get(guild.ownerId)).replaceAll("{server.ownertag}", guild.members.cache.get(guild.ownerId).user.tag).replaceAll("{server.ownername}", guild.members.cache.get(guild.ownerId).user.username).replaceAll("{server.id}", guild.id).replaceAll("{guild.name}", guild.name).replaceAll("{guild.icon}", guild.iconURL()).replaceAll("{guild.animatedicon}", guild.iconURL({
          dynamic: true
        })).replaceAll("{guild.iconurl}", guild.iconURL()).replaceAll("{guild.membercount}", guild.members.cache.size).replaceAll("{guild.membercountformatted}", formatcount(guild.members.cache.size)).replaceAll("{guild.owner}", guild.members.cache.get(guild.ownerId)).replaceAll("{guild.ownertag}", guild.members.cache.get(guild.ownerId).user.tag).replaceAll("{guild.ownername}", guild.members.cache.get(guild.ownerId).user.username).replaceAll("{guild.id}", guild.id)
        return content
      }
    }
    let data = await functions.getdb(gdb, {
      _id: member.guild.id
    })
    if (!data || data.welcome_channel == null || !find_channel(data.welcome_channel) || (!data.welcome_message.content)) return;
    let channel = find_channel(data.welcome_channel)
    let wmsg = data.welcome_message
    if (wmsg.embed.title == null && wmsg.embed.description == null && wmsg.embed_enabled == true) return channel.send({
      content: "Welcome Embed Title And Description Missing, One Is Required, Or Just Disable Welcome Embed"
    })

    if (wmsg.text_enabled == true && wmsg.embed_enabled == true) {
      channel.send({
        content: `${format(wmsg.content)}`,
        embeds: [format(wmsg.embed)]
      })
    } else if (wmsg.text_enabled == true && wmsg.embed_enabled == false) {
      channel.send({
        content: `${format(wmsg.content)}`
      })
    } else if (wmsg.text_enabled == false && wmsg.embed_enabled == true) {
      channel.send({
        embeds: [format(wmsg.embed)]
      })
    }

  },
};

/*
function format(data){
        if(typeof data == 'object'){
          let content = {}
          if(data.description){
            data.description = format(data.description)
          }
          if(data.title){
            data.title = format(data.description)
          }
          return data
        } else {
          let content = data.replaceAll("{user}", member).replaceAll("{member}", member).replaceAll("{tag}", member.user.tag).replaceAll("{server}", member.guild.name).replaceAll("{guild}", member.guild.name).replaceAll("{username}", member.user.username).replaceAll("{servername}", member.guild.name).replaceAll("{guildname}", member.guild.name)
          return content
        }
      }
        let data = await functions.getdb(gdb, {
            _id: member.guild.id
        })
        if (!data || data.welcome_channel == null || !find_channel(data.welcome_channel)) return;
        let channel = find_channel(data.welcome_channel)
        let wmsg = data.welcome_message
        if(wmsg.embed){
          if(wmsg.content){
            channel.send({
            content: format(wmsg.content),
            embeds: [format(wmsg.embed)]
        })
          } else {
            channel.send({
            embeds: [format(wmsg.embed)]
        })
          }
        } else {
          channel.send({
            content: wmsg.content
        })
        }
*/
const Discord = require("discord.js")
let gdb = require("../../Models/Guild")
let functions = require("../../functions.js")
module.exports = {
  name: "testwelcome",
  aliases: ["tw"],
  permission: ["ADMINISTRATOR"],
  category: "configuration",
  req_perms: ["SEND_MESSAGES"],
  usage: ["$testwelcome"],
  description: "test skizos your servers welcome message",
  run: async (client, message, args) => {
    /*
let variables = [
      "{member.id}",
      "{member.name}",
      "{member.tag}",
      "{member.avatar}",
      "{member.animatedavatar}"
      "{member.avatarurl}"
      "{member.mention}",
      "{user.id}",
      "{user.name}",
      "{user.tag}",
      "{user.avatar}",
      "{user.animatedavatar}",
      "{user.avatarurl}",
      "{user.mention}",
      "{guild.name}",
      "{guild.icon}",
      "{guild.animatedicon}",
      "{guild.iconurl}",
      "{guild.membercount}",
      "{guild.membercountformatted}",
      "{guild.owner}",
      "{guild.ownertag}",
      "{guild.ownername}",
      "{guild.id}",
      "{server.name}",
      "{server.icon}",
      "{server.animatedicon}",
      "{server.iconurl}",
      "{server.membercount}",
      "{server.membercountformatted}",
      "{server.owner}",
      "{server.ownertag}",
      "{server.ownername}",
      "{server.id}"
    ]
    */
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    let member = message.member
    let guild = member.guild
    function formatcount(num){
      let th_arr = ["0","1","4","5","6","7","8","9"]
      //ends with 0,4,5,6,7,8,9: th
      //ends with 1: st, if is greater than 100 and ends with 1 :th
      let strnum = ''+num
      if(num > 99 || th_arr.includes(strnum[strnum.length-1]) && strnum!=="1"){
        return strnum+"th"
      } else if(strnum == "1"){
        return strnum+"st"
      } else if(strnum == "2"){
        return strnum+"nd"
      } else if(strnum == "3"){
        return strnum+"rd"
      }
    }
    function format(data) {
      
      if (typeof data == 'object') {
        
        if (data.description) {
          data.description = format(data.description)
        }
        if(data.image && data.image.url !== null){
          data.image.url = format(data.image.url)
        }
        if(data.thumbnail && data.thumbnail.url !== null){
          data.thumbnail.url = format(data.thumbnail.url)
        }
        if (data.title) {
          data.title = format(data.title)
        }
        if(data.footer && data.footer.text !== null || data.footer.iconURL !== null){
          
          if(data.footer.text !== null){
            data.footer.text = format(data.footer.text)
          }
          if(data.footer.iconURL !== null){
            data.footer.iconURL = format(data.footer.iconURL)
          }
          data.footer = data.footer
        }
        if(data.author && data.author.name !== null || data.author.iconURL !== null){
          
          if(data.author.name !== null){
            data.author.name = format(data.author.name)
          }
          if(data.author.iconURL !== null){
            data.author.iconURL = format(data.author.iconURL)
          }
          data.author = data.author
        }
        return data
      } else if(typeof data == 'string') {
        let content = data.replaceAll("{member.tag}", member.user.tag).replaceAll("{member.name}", member.user.username).replaceAll("{member.username}", member.user.username).replaceAll("{tag}", member.user.tag).replaceAll("{member.tag}", member.user.tag).replaceAll("{member.id}", member.id).replaceAll("{member.avatar}", member.displayAvatarURL()).replaceAll("{member.mention}", member).replaceAll("{member.animatedavatar}", member.displayAvatarURL({dynamic: true})).replaceAll("{member.avatarurl}", member.displayAvatarURL({dynamic: true})).replaceAll("{user.tag}", member.user.tag).replaceAll("{user.id}", member.id).replaceAll("{user.name}", member.user.username).replaceAll("{user.username}", member.user.username).replaceAll("{tag}", member.user.tag).replaceAll("{user.tag}", member.user.tag).replaceAll("{user.avatar}", member.displayAvatarURL()).replaceAll("{user.mention}", member).replaceAll("{user.animatedavatar}", member.displayAvatarURL({dynamic: true})).replaceAll("{user.avatarurl}", member.displayAvatarURL({dynamic: true})).replaceAll("{server.name}", guild.name).replaceAll("{server.icon}", guild.iconURL()).replaceAll("{server.animatedicon}", guild.iconURL({dynamic: true})).replaceAll("{server.iconurl}", guild.iconURL()).replaceAll("{server.membercount}", guild.members.cache.size).replaceAll("{server.membercountformatted}", formatcount(guild.members.cache.size)).replaceAll("{server.owner}", guild.members.cache.get(guild.ownerId)).replaceAll("{server.ownertag}", guild.members.cache.get(guild.ownerId).user.tag).replaceAll("{server.ownername}", guild.members.cache.get(guild.ownerId).user.username).replaceAll("{server.id}", guild.id).replaceAll("{guild.name}", guild.name).replaceAll("{guild.icon}", guild.iconURL()).replaceAll("{guild.animatedicon}", guild.iconURL({dynamic: true})).replaceAll("{guild.iconurl}", guild.iconURL()).replaceAll("{guild.membercount}", guild.members.cache.size).replaceAll("{guild.membercountformatted}", formatcount(guild.members.cache.size)).replaceAll("{guild.owner}", guild.members.cache.get(guild.ownerId)).replaceAll("{guild.ownertag}", guild.members.cache.get(guild.ownerId).user.tag).replaceAll("{guild.ownername}", guild.members.cache.get(guild.ownerId).user.username).replaceAll("{guild.id}", guild.id)
        return content
      }
    }

    let data = await functions.getdb(gdb, {
      _id: member.guild.id
    })
    if (!data) {
      data = new gdb(gs)
      data.save()
      let channel = message.channel
      let wmsg = data.welcome_message
      if(wmsg.embed_enabled == false && wmsg.text_enabled == false) return message.reply({content: "Welcome Embed And Text Are Both Disabled"})
      if(wmsg.embed.title == null && wmsg.embed.description == null && wmsg.embed_enabled == true) return message.reply({content: "Welcome Embed Title And Description Missing, One Is Required, Or Just Disable Welcome Embed"})
      
      if(wmsg.text_enabled == true && wmsg.embed_enabled == true){
        message.channel.send({content: `${format(wmsg.content)}`, embeds: [format(wmsg.embed)]})
      } else if(wmsg.text_enabled == true && wmsg.embed_enabled == false){
        message.channel.send({content: `${format(wmsg.content)}`})
      } else if(wmsg.text_enabled == false && wmsg.embed_enabled == true){
        message.channel.send({embeds: [format(wmsg.embed)]})
      }
    } else {
      let channel = message.channel
      let wmsg = data.welcome_message
      if(wmsg.embed_enabled == false && wmsg.text_enabled == false) return message.reply({content: "Welcome Embed And Text Are Both Disabled"})
      if(wmsg.embed.title == null && wmsg.embed.description == null && wmsg.embed_enabled == true) return message.reply({content: "Welcome Embed Title And Description Missing, One Is Required, Or Just Disable Welcome Embed"})

      if(wmsg.text_enabled == true && wmsg.embed_enabled == true){
        message.channel.send({content: `${format(wmsg.content)}`, embeds: [format(wmsg.embed)]})
      } else if(wmsg.text_enabled == true && wmsg.embed_enabled == false){
        message.channel.send({content: `${format(wmsg.content)}`})
      } else if(wmsg.text_enabled == false && wmsg.embed_enabled == true){
        message.channel.send({embeds: [format(wmsg.embed)]})
      }
    }

  },
}

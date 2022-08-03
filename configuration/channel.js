const Discord = require("discord.js")
const print = console.log
const db = require("../../Models/UserVoice");



module.exports = {
  name: "channel",
  aliases: ["chnl"],
  category: "configuration",
  permission: [],
  req_perms: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
  usage: ["$channel <rename/delete/userlimit/lock/unlock>", "$channel rename <name>", "$channel delete", "$channel userlimit <[1-99]>", "$channel lock"],
  description: "custom user owned channe rename",
  run: async (client, message, args) => {
    let actions = ["rename", "delete", "userlimit", "lock", "unlock"]
    if(!args[0]) return message.reply({content: `Argument Missing: \`action: ${actions.join(", ")}\``})
    let action = args[0].toLowerCase()
    
    //if user joins certain vc, create new channel, 
    if (["rename"].includes(action)) {
      //uid, gid, cid
      db.findOne({
        _uid: message.author.id,
        _gid: message.guild.id
      }, async (err, data) => {
        if (err) throw err;
        if (data && message.guild.channels.cache.get(data._cid)) {
          args.shift()
          let channel = message.guild.channels.cache.get(data._cid)
          channel.setName(args.join(" "))
          message.channel.send({
            content: `Personal vc \`${channel.name}\` named changed`
          })

        } else {
          return message.channel.send({
            content: "You do not have a personal vc"
          })
        }
      })
    } else if (["delete", "remove"].includes(action)) {
      db.findOne({
        _uid: message.author.id,
        _gid: message.guild.id
      }, async (err, data) => {
        if (err) throw err
        if (!data) return message.channel.send({
          content: "You do not have a personal vc"
        });

        if (data) {
          let channel = message.guild.channels.cache.get(data._cid)
          channel.delete()
          try {
            await db.findOneAndDelete({
              _uid: message.author.id,
              _gid: message.guild.id
            }, (err, res) => {
              if (err) throw err;
            }).then(message.channel.send({
              content: "Personal vc deleted"
            })).catch(err => {
              return
            })
          } catch (err) {
            return
          }
        }
      })
    } else if (["userlimit", "limit"].includes(action)) {
      args.shift()
      let limit = args[0]

      if (isNaN(limit)) return console.log("not a number")
      if (limit > 99 || limit < 0) return message.channel.send({
        content: "User limit must be less than or equal to 99 and greater than or equal to 0(No User Limit)"
      })
      db.findOne({
        _uid: message.author.id,
        _gid: message.guild.id
      }, async (err, data) => {
        if (err) throw err;
        if (data && message.guild.channels.cache.get(data._cid)) {
          args.shift()
          let channel = message.guild.channels.cache.get(data._cid)

          channel.setUserLimit(limit)
          message.channel.send({
            content: `Personal vc \`${channel.name}\` limit changed`
          })

        } else {
          return message.channel.send({
            content: "You do not have a personal vc"
          })
        }
      })
    } else if(["lock"].includes(action)){
      let data = await db.findOne({_gid: message.guild.id, _uid: message.author.id})
      if(!data || !message.guild.channels.cache.get(data._cid)) return message.reply({content: "You do not have a personal vc"})
      let channel = message.guild.channels.cache.get(data._cid)
      channel.permissionOverwrites.edit(message.guild.roles.everyone,{ 'CONNECT': false }).catch(err => {
        message.reply({content: `${err}`})
      })
      return message.reply({content: `Personal vc \`${channel.name}\` is now locked 🔐`})
      
    } else if(["unlock"].includes(action)) {
      let data = await db.findOne({_gid: message.guild.id, _uid: message.author.id})
      if(!data || !message.guild.channels.cache.get(data._cid)) return message.reply({content: "You do not have a personal vc"})
      let channel = message.guild.channels.cache.get(data._cid)
      channel.permissionOverwrites.edit(message.guild.roles.everyone,{ 'CONNECT': true }).catch(err => {
        message.reply({content: `${err}`})
      })
      return message.reply({content: `Personal vc \`${channel.name}\` is now unlocked 🔓`})
    } else {
      return message.reply({content: `Argument Invalid: \`action: ${actions.join(", ")}\``})
    }




  },
}
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
  name: "voiceStateUpdate",
  once: false,
  async execute(oldState, newState) {
    if (newState.member.bot) return;
    let oldUserChannel = oldState.channel
    let newUserChannel = newState.channel
    let member = newState.member
    let guild = member.guild
    let ggdata = await functions.getdb(gdb, {
      _id: guild.id
    })
    if (!ggdata || ggdata.jtc == null) return
    if(member.id == client.user.id) return;
    if (!guild.me.permissions.has("MANAGE_CHANNELS")) {
      try {
        functions.sendbotlogs(guild, {title: `Join To Create`, description: `Im Missing The Following Permissions: \`MANAGE_CHANNELS\`\nTrying To Manage A Channel For A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
        member.send({
          content: "I Am Missing The Following Permission: `MANAGE_CHANNELS`"
        }).catch(err => {
          return
        })
      } catch (err) {
        return
      }
    }
    if (!guild.me.permissions.has("MOVE_MEMBERS")) {
      try {
        functions.sendbotlogs(guild, {title: `Join To Create`, description: `Im Missing The Following Permissions: \`MOVE_MEMBERS\`\nTrying To Manage A Channel For A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
        member.send({
          content: "I Am Missing The Following Permission: `MOVE_MEMBERS`"
        }).catch(err => {
          return
        })
      } catch (err) {
        return
      }
    }

    function find_channel(id) {
      if (!guild.channels.cache.get(id)) return false
      return guild.channels.cache.get(id)
    }

    let gdata = await functions.getdb(gdb, {
      _id: guild.id
    })
    if (!gdata || gdata.jtc == null || !find_channel(gdata.jtc)) return
    let othevc = find_channel(gdata.jtc)
    if (oldUserChannel === null && newUserChannel.id === othevc.id) {
      // User Joins a voice channel

      db.findOne({
        _uid: member.id,
        _gid: guild.id
      }, async (err, data) => {
        if (err) throw err;
        if (data) {
          let channel = guild.channels.cache.get(data._cid)
          member.voice.setChannel(channel)
        }
        if (!data) {
          let channel_data = {
            type: 'GUILD_VOICE',
          }
          if (othevc.parent) {
            channel_data.parent = othevc.parent.id
          }
          guild.channels.create(`${member.user.username}`, channel_data).then(result => {
            data = new db({
              _uid: member.id,
              _gid: guild.id,
              _cid: result.id
            })
            data.save()
            member.voice.setChannel(result)
          })


        }
      })

    } else if (newUserChannel === null) {
      // User leaves a voice channel
      // check if olduserchannel id is found in database
      if (oldUserChannel.id == othevc.id) return;
      let members = []
      oldUserChannel.members.map(m => members.push(m.id))
      //for loop to check if database etc
      if (members.length <= 0) {
        db.findOne({
          _gid: guild.id,
          _cid: oldUserChannel.id
        }, async (err, data) => {
          if (err) throw err;
          if (!data) return;
          if (data && data._uid && guild.channels.cache.get(data._cid) && oldUserChannel !== null) {

            await db.findOneAndDelete({
              _uid: data._uid,
              _gid: guild.id,
              _cid: oldUserChannel.id
            }).catch({})
            oldUserChannel.delete().catch(err => {
              return functions.sendbotlogs(guild, {title: `Join To Create`, description: `${err}\nTrying To Delete A Channel For A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
            })
          }
        })
      }

    } else if (oldUserChannel != newUserChannel) {

      let members = []
      try {
        if (oldUserChannel.members) {
          oldUserChannel.members.map(m => members.push(m.id))
        }
      } catch (err) {
        return;
      }
      if (newUserChannel.id == othevc.id) {
        let member = newState.member
        db.findOne({
          _uid: member.id,
          _gid: guild.id
        }, async (err, data) => {
          if (err) throw err;
          if (data) {
            let channel = guild.channels.cache.get(data._cid)
            member.voice.setChannel(channel)
          }
          if (!data) {
            let channel_data = {
              type: 'GUILD_VOICE',
            }
            if (othevc.parent) {
              channel_data.parent = othevc.parent.id
            }
            guild.channels.create(`${member.user.username}`, channel_data).then(result => {
              data = new db({
                _uid: member.id,
                _gid: guild.id,
                _cid: result.id
              })
              data.save()
              member.voice.setChannel(result)
            }).catch(err => {
              return functions.sendbotlogs(guild, {title: `Join To Create`, description: `${err}\nTrying To Create A Channel For A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
            })


          }
        })
      } else if (members.length <= 0) {
        db.findOne({
          _gid: guild.id,
          _cid: oldUserChannel.id
        }, async (err, data) => {
          if (err) throw err;
          if (!data) return;
          if (data && data._uid && guild.channels.cache.get(data._cid) && oldUserChannel !== null) {

            try {
              await db.findOneAndDelete({
                _uid: data._uid,
                _gid: guild.id,
                _cid: oldUserChannel.id
              }).catch(err => {
                return
              })
            } catch (err) {
              return
            }
            oldUserChannel.delete().catch(err => {
              return functions.sendbotlogs(guild, {title: `Join To Create`, description: `${err}\nTrying To Delete A Channel For A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
            })
          }
        })
      }
    }


  },
};
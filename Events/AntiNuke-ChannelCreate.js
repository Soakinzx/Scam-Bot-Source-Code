let fs = require('fs');
let client = require("../index.js")
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
let functions = require("../functions.js")
const usersMap = new Map()
module.exports = {
  name: "channelCreate",
  once: false,
  async execute(channel) {
    //db.guilds.find({_id: "981659394615963708"})
    let guild = channel.guild
    if (!guild) return;

    if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Channel Create`,
          description: `Im Missing Permissions: \`VIEW_AUDIT_LOG\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }
    const AuditLogFetch = await guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_CREATE"
    });
    if (!AuditLogFetch.entries.first()) {
      return
    }
    
    const Entry = AuditLogFetch.entries.first(); // Getting the first entry of AuditLogs that was found.
    const user = Entry.executor
    const member = guild.members.cache.get(user.id)
    if (!member || member.id == client.user.id || member.id == guild.ownerId) return;




    let data = await functions.getdb(gdb, {
      _id: guild.id
    })
    if (!data || data.antinuke == false || data.whitelisted.includes(member.id) || member.roles.cache.has(data.whitelistrole) || data.trusted.includes(member.id) || member.roles.cache.has(data.trustrole)) return
  
    if (!guild.me.permissions.has("MANAGE_CHANNELS")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Channel Create`,
          description: `Im Missing Permissions: \`MANAGE_CHANNELS\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }
    if (!guild.me.permissions.has("MANAGE_MEMBERS")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Channel Create`,
          description: `Im Missing Permissions: \`MANAGE_MEMBERS\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }


    const LIMIT = data.antinukesettings.channels_created_before_time_before_quarantine;

    const DIFF = data.antinukesettings.channels_created_time * 1000
    const TIME = data.antinukesettings.channels_created_time * 1000
    if (usersMap.has(member.id)) {
      
      const userData = usersMap.get(member.id);
      userData.channels_created.push(channel)
      const {
        lastCreatedChannel,
        timer
      } = userData;
      const difference = channel.createdTimestamp - lastCreatedChannel.createdTimestamp;
      let chnlCount = userData.chnlCount;


      if (difference > DIFF) {

        clearTimeout(timer);

        userData.chnlCount = 1;
        userData.lastCreatedChannel = channel;
        userData.timer = setTimeout(() => {
          usersMap.delete(member.id);
        }, TIME);
        usersMap.set(member.id, userData)
      } else {
        ++chnlCount;
        
        if (parseInt(chnlCount) >= LIMIT) {
          userData.channels_created.forEach(chnl => {
            chnl.delete().catch(err => {
              return;
            })
          })
          usersMap.delete(member.id)
          let quarantined = functions.quarantine(member)
          
          if (quarantined !== true) {
            if (member.user.bot) {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Channel Create`,
                description: `Quarantine Role Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
              guild.bans.create(member, {
                reason: `Created ${LIMIT} channels before ${TIME/1000} seconds`
              }).then(async () => {
                await functions.dont_save_roles(member)
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Channel Create`,
                  description: `Quarantine Role Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Bot: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              }).catch(err => {
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Channel Create`,
                  description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              })
              return;
            } else {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Channel Create`,
                description: `Quarantine Role Does Not Exist/Not Set, Trying To Kick Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
              member.kick(`Created ${LIMIT} channels before ${TIME/1000} seconds`).then(async () => {
                await functions.dont_save_roles(member)
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Channel Create`,
                  description: `Quarantine Role Does Not Exist/Not Set, Kicked Member Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Member: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              }).catch(err => {
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Channel Create`,
                  description: `${err}\nTrying To Quarantine A User Failed Resorted To Kicking Member Also Failed: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              })
              return;
            }
            return;
          }
          return functions.sendbotlogs(guild, {
            title: `Anti-Nuke Channel Create`,
            description: `Quarantined User: ${member.user.tag}\nCreated ${LIMIT} channels before ${TIME/1000} seconds`,
            color: "DARK_BUT_NOT_BLACK"
          })

        } else {
          userData.chnlCount = chnlCount;
          usersMap.set(member.id, userData);
        }
      }
    } else {

      let fn = setTimeout(() => {
        usersMap.delete(member.id);
      }, TIME);
      usersMap.set(member.id, {
        chnlCount: 1,
        lastCreatedChannel: channel,
        timer: fn,
        channels_created: [channel]
      });
      let {
        chnlCount
      } = usersMap.get(member.id)
      if (parseInt(chnlCount) >= LIMIT) {
        let quarantined = functions.quarantine(member)
        channel.delete()
        usersMap.delete(member.id)
        if (quarantined !== true) {
          if (member.user.bot) {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Channel Create`,
              description: `Quarantine Role Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
            guild.bans.create(member, {
              reason: `Created ${LIMIT} channels before ${TIME/1000} seconds`
            }).then(async () => {
              await functions.dont_save_roles(member)
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Channel Create`,
                description: `Quarantine Role Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Bot: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            }).catch(err => {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Channel Create`,
                description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            })
            return;
          } else {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Channel Create`,
              description: `Quarantine Role Does Not Exist/Not Set, Trying To Kick Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
            member.kick(`Created ${LIMIT} channels before ${TIME/1000} seconds`).then(async () => {
              await functions.dont_save_roles(member)
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Channel Create`,
                description: `Quarantine Role Does Not Exist/Not Set, Kicked Member Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Member: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            }).catch(err => {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Channel Create`,
                description: `${err}\nTrying To Quarantine A User Failed Resorted To Kicking Member Also Failed: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            })
            return;
          }
          return;
        }
        return functions.sendbotlogs(guild, {
            title: `Anti-Nuke Channel Create`,
            description: `Quarantined User: ${member.user.tag}\nCreated ${LIMIT} channels before ${TIME/1000} seconds`,
            color: "DARK_BUT_NOT_BLACK"
          })
        
      }
    }
  },
};
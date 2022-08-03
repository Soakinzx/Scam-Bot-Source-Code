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
  name: "guildBanAdd",
  once: false,
  async execute(ban) {
    //db.guilds.find({_id: "981659394615963708"})
    let guild = ban.guild
    if (!guild) return;


    const AuditLogFetch = await guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_BAN_ADD"
    });
    if (!AuditLogFetch.entries.first()) {
      return
    }
    const Entry = AuditLogFetch.entries.first(); // Getting the first entry of AuditLogs that was found.
    const user = Entry.executor
    const member = guild.members.cache.get(user.id)
    const member_banned = ban.user.id
    
    if (!member || member.id == client.user.id || member.id == guild.ownerId) return;




    let data = await functions.getdb(gdb, {
      _id: guild.id
    })
    if (!data || data.antinuke == false || data.whitelisted.includes(member.id) || member.roles.cache.has(data.whitelistmember) || data.trusted.includes(member.id) || member.roles.cache.has(data.trustmember)) return


    if (!guild.me.permissions.has("MANAGE_MEMBERS")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Member Ban`,
          description: `Im Missing Permissions: \`MANAGE_MEMBERS\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }

    if (!guild.me.permissions.has("MANAGE_ROLES")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Member Ban`,
          description: `Im Missing Permissions: \`MANAGE_ROLES\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }


    const LIMIT = data.antinukesettings.members_banned_before_time_before_quarantine;

    const DIFF = data.antinukesettings.members_banned_time * 1000
    const TIME = data.antinukesettings.members_banned_time * 1000
    if (usersMap.has(member.id)) {

      const userData = usersMap.get(member.id);
      userData.members_banned.push(member_banned)
      const {
        lastBannedMember,
        timer
      } = userData;
      const difference = Date.now() - lastBannedMember;
      let memberCount = userData.memberCount;


      if (difference > DIFF) {

        clearTimeout(timer);

        userData.memberCount = 1;
        userData.lastBannedMember = Date.now();
        userData.timer = setTimeout(() => {
          usersMap.delete(member.id);
        }, TIME);
        usersMap.set(member.id, userData)
      } else {
        ++memberCount;

        if (parseInt(memberCount) >= LIMIT) {
          userData.members_banned.forEach(me => {
            guild.bans.remove(me, {
              reason: `Banned ${LIMIT} members before ${TIME/1000} seconds`
            }).catch(err => {
              let i = 0
            })
          })
          usersMap.delete(member.id)
          let quarantined = functions.quarantine(member)

          if (quarantined !== true) {
            if (member.user.bot) {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Member Ban`,
                description: `Quarantine Member Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
              guild.bans.create(member, {
                reason: `Banned ${LIMIT} members before ${TIME/1000} seconds`
              }).then(async () => {
                await functions.dont_save_members(member)
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Member Ban`,
                  description: `Quarantine Member Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Baning Bot: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              }).catch(err => {
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Member Ban`,
                  description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              })
              return;
            } else {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Member Ban`,
                description: `Quarantine Member Does Not Exist/Not Set, Trying To Ban Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
              member.ban(`Banned ${LIMIT} members before ${TIME/1000} seconds`).then(async () => {
                await functions.dont_save_members(member)
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Member Ban`,
                  description: `Quarantine Member Does Not Exist/Not Set, Banned Member Instead...\nTrying To Quarantine A User Failed Resorted To Baning Member: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              }).catch(err => {
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Member Ban`,
                  description: `${err}\nTrying To Quarantine A User Failed Resorted To Baning Member Also Failed: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              })
              return;
            }
            return;
          }
          return functions.sendbotlogs(guild, {
            title: `Anti-Nuke Member Ban`,
            description: `Quarantined User: ${member.user.tag}\nBanned ${LIMIT} members before ${TIME/1000} seconds`,
            color: "DARK_BUT_NOT_BLACK"
          })

        } else {
          userData.memberCount = memberCount;
          usersMap.set(member.id, userData);
        }
      }
    } else {

      let fn = setTimeout(() => {
        usersMap.delete(member.id);
      }, TIME);
      usersMap.set(member.id, {
        memberCount: 1,
        lastBannedMember: Date.now(),
        timer: fn,
        members_banned: [member_banned]
      });
      let {
        memberCount
      } = usersMap.get(member.id)
      if (parseInt(memberCount) >= LIMIT) {
        guild.bans.remove(member_banned, {
          reason: `Banned ${LIMIT} members before ${TIME/1000} seconds`
        }).catch(err => {
          let i = 0
        })
        usersMap.delete(member.id)
        let quarantined = functions.quarantine(member)

        if (quarantined !== true) {

          if (member.user.bot) {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Member Ban`,
              description: `Quarantine Member Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
            guild.bans.create(member, {
              reason: `Banned ${LIMIT} members before ${TIME/1000} seconds`
            }).then(async () => {
              await functions.dont_save_members(member)
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Member Ban`,
                description: `Quarantine Member Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Baning Bot: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            }).catch(err => {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Member Ban`,
                description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            })
            return;
          } else {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Member Ban`,
              description: `Quarantine Member Does Not Exist/Not Set, Trying To Ban Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
            member.ban(`Banned ${LIMIT} members before ${TIME/1000} seconds`).then(async () => {
              await functions.dont_save_members(member)
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Member Ban`,
                description: `Quarantine Member Does Not Exist/Not Set, Banned Member Instead...\nTrying To Quarantine A User Failed Resorted To Baning Member: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            }).catch(err => {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Member Ban`,
                description: `${err}\nTrying To Quarantine A User Failed Resorted To Baning Member Also Failed: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            })
            return;
          }
          return;
        }
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Member Ban`,
          description: `Quarantined User: ${member.user.tag}\nBanned ${LIMIT} members before ${TIME/1000} seconds`,
          color: "DARK_BUT_NOT_BLACK"
        })

      }
    }
  },
};
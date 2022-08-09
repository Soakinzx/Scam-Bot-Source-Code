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
  name: "roleDelete",
  once: false,
  async execute(role) {
    //db.guilds.find({_id: "981659394615963708"})
    let guild = role.guild
    if (!guild) return;

    if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) {
      return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Role Delete`,
          description: `Im Missing Permissions: \`VIEW_AUDIT_LOG\``,
          color: "DARK_BUT_NOT_BLACK"
      })
    }


    const AuditLogFetch = await guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_DELETE"
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

    if (!guild.me.permissions.has("MANAGE_roles")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Role Delete`,
          description: `Im Missing Permissions: \`MANAGE_roles\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }
    if (!guild.me.permissions.has("MANAGE_MEMBERS")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Role Delete`,
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
          title: `Anti-Nuke Role Delete`,
          description: `Im Missing Permissions: \`MANAGE_ROLES\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }


    const LIMIT = data.antinukesettings.roles_deleted_before_time_before_quarantine;

    const DIFF = data.antinukesettings.roles_deleted_time * 1000
    const TIME = data.antinukesettings.roles_deleted_time * 1000
    if (usersMap.has(member.id)) {

      const userData = usersMap.get(member.id);
      userData.roles_deleted.push(role)
      const {
        lastDeletedRole,
        timer
      } = userData;
      const difference = Date.now() - lastDeletedRole;
      let roleCount = userData.roleCount;


      if (difference > DIFF) {

        clearTimeout(timer);

        userData.roleCount = 1;
        userData.lastDeletedRole = Date.now();
        userData.timer = setTimeout(() => {
          usersMap.delete(member.id);
        }, TIME);
        usersMap.set(member.id, userData)
      } else {
        ++roleCount;

        if (parseInt(roleCount) >= LIMIT) {

          usersMap.delete(member.id)
          let quarantined = functions.quarantine(member)
          if (quarantined !== true) {
            if (member.user.bot) {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Role Delete`,
                description: `Quarantine Role Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
              guild.bans.create(member, {
                reason: `Deleted ${LIMIT} roles before ${TIME/1000} seconds`
              }).then(async () => {
                await functions.dont_save_roles(member)
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Role Delete`,
                  description: `Quarantine Role Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Bot: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
                userData.roles_deleted.forEach(async (r) => {
                  await functions.clonerole(r)
                  await functions.refresh_quarantine(guild)
                })
              }).catch(err => {
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Role Delete`,
                  description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              })
              return;
            } else {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Role Delete`,
                description: `Quarantine Role Does Not Exist/Not Set, Trying To Kick Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
              member.kick(`Deleted ${LIMIT} roles before ${TIME/1000} seconds`).then(async () => {
                await functions.dont_save_roles(member)
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Role Delete`,
                  description: `Quarantine Role Does Not Exist/Not Set, Kicked Member Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Member: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
                userData.roles_deleted.forEach(async (r) => {
                  await functions.clonerole(r)
                  await functions.refresh_quarantine(guild)
                })
              }).catch(err => {
                functions.sendbotlogs(guild, {
                  title: `Anti-Nuke Role Delete`,
                  description: `${err}\nTrying To Quarantine A User Failed Resorted To Kicking Member Also Failed: ${member.user.tag}`,
                  color: "DARK_BUT_NOT_BLACK"
                })
              })

              return;
            }
            return;
          }

          return functions.sendbotlogs(guild, {
            title: `Anti-Nuke Role Delete`,
            description: `Quarantined User: ${member.user.tag}\nDeleted ${LIMIT} roles before ${TIME/1000} seconds`,
            color: "DARK_BUT_NOT_BLACK"
          })

        } else {
          userData.roleCount = roleCount;
          usersMap.set(member.id, userData);
        }
      }
    } else {

      let fn = setTimeout(() => {
        usersMap.delete(member.id);
      }, TIME);
      usersMap.set(member.id, {
        roleCount: 1,
        lastDeletedRole: Date.now(),
        timer: fn,
        roles_deleted: [role]
      });
      let {
        roleCount
      } = usersMap.get(member.id)
      if (parseInt(roleCount) >= LIMIT) {

        usersMap.delete(member.id)
        let quarantined = functions.quarantine(member)

        if (quarantined !== true) {

          if (member.user.bot) {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Role Delete`,
              description: `Quarantine Role Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
            guild.bans.create(member, {
              reason: `Deleted ${LIMIT} roles before ${TIME/1000} seconds`
            }).then(async () => {
              await functions.dont_save_roles(member)
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Role Delete`,
                description: `Quarantine Role Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Bot: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            }).catch(err => {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Role Delete`,
                description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            })
            return;
          } else {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Role Delete`,
              description: `Quarantine Role Does Not Exist/Not Set, Trying To Kick Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
            member.kick(`Deleted ${LIMIT} roles before ${TIME/1000} seconds`).then(async () => {
              await functions.dont_save_roles(member)
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Role Delete`,
                description: `Quarantine Role Does Not Exist/Not Set, Kicked Member Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Member: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            }).catch(err => {
              functions.sendbotlogs(guild, {
                title: `Anti-Nuke Role Delete`,
                description: `${err}\nTrying To Quarantine A User Failed Resorted To Kicking Member Also Failed: ${member.user.tag}`,
                color: "DARK_BUT_NOT_BLACK"
              })
            })
            return;
          }
          return;
        }
        await functions.clonerole(role)
        await functions.refresh_quarantine(guild)
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Role Delete`,
          description: `Quarantined User: ${member.user.tag}\nDeleted ${LIMIT} roles before ${TIME/1000} seconds`,
          color: "DARK_BUT_NOT_BLACK"
        })

      }
    }
  },
};
/*
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

module.exports = {
  name: "roleDelete",
  once: false,
  async execute(role) {
    //db.guilds.find({_id: "981659394615963708"})
    let guild = role.guild
    if (!guild) return;


    const AuditLogFetch = await guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_DELETE"
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
    if (!data || data.antinuke == false || data.antinukesettings.quarantine_on_roles_removed == false || data.whitelisted.includes(member.id) || member.roles.cache.has(data.whitelistrole) || data.trusted.includes(member.id) || member.roles.cache.has(data.trustrole)) return

    if (!guild.me.permissions.has("MANAGE_ROLES")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Roles Deleted`,
          description: `Im Missing Permissions: \`MANAGE_ROLES\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }
    if (!guild.me.permissions.has("MANAGE_MEMBERS")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Roles Deleted`,
          description: `Im Missing Permissions: \`MANAGE_MEMBERS\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }
    if (!guild.me.permissions.has("MANAGE_roles")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Roles Deleted`,
          description: `Im Missing Permissions: \`MANAGE_MEMBERS\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }

    let cloned = await functions.clonerole(role)
    let quarantined = functions.quarantine(member)
    if (quarantined !== true) {
      
      if (member.user.bot) {
        functions.sendbotlogs(guild, {
          title: `Anti-Nuke Roles Deleted`,
          description: `Quarantine Role Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
          color: "DARK_BUT_NOT_BLACK"
        })
        guild.bans.create(member, {
          reason: `Deleted ${role.name}`
        }).then(async () => {
          functions.sendbotlogs(guild, {
            title: `Anti-Nuke Roles Deleted`,
            description: `Quarantine Role Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Bot: ${member.user.tag}`,
            color: "DARK_BUT_NOT_BLACK"
          })
        }).catch(err => {
          functions.sendbotlogs(guild, {
            title: `Anti-Nuke Roles Deleted`,
            description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
            color: "DARK_BUT_NOT_BLACK"
          })
        })
        return;
      } else {
        functions.sendbotlogs(guild, {
          title: `Anti-Nuke Roles Deleted`,
          description: `Quarantine Role Does Not Exist/Not Set, Trying To Kick Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
          color: "DARK_BUT_NOT_BLACK"
        })
        member.kick(`Deleted ${role.name}`).then(async () => {
          functions.sendbotlogs(guild, {
            title: `Anti-Nuke Roles Deleted`,
            description: `Quarantine Role Does Not Exist/Not Set, Kicked Member Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Member: ${member.user.tag}`,
            color: "DARK_BUT_NOT_BLACK"
          })
        }).catch(err => {
          functions.sendbotlogs(guild, {
            title: `Anti-Nuke Roles Deleted`,
            description: `${err}\nTrying To Quarantine A User Failed Resorted To Kicking Member Also Failed: ${member.user.tag}`,
            color: "DARK_BUT_NOT_BLACK"
          })
        })
        return;
      }
      return;
    }
    return functions.sendbotlogs(guild, {
      title: `Anti-Nuke Roles Deleted`,
      description: `Quarantined User: ${member.user.tag}\nDeleted ${role.name}`,
      color: "DARK_BUT_NOT_BLACK"
    })


  },
};
*/

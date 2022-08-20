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
  name: "roleUpdate",
  once: false,
  async execute(role, newrole) {
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
      type: "ROLE_UPDATE"
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
    if (!data || data.antinuke == false || data.antinukesettings.quarantine_on_dangerous_permissions_added == false || data.whitelisted.includes(member.id) || member.roles.cache.has(data.whitelistrole) || data.trusted.includes(member.id) || member.roles.cache.has(data.trustrole)) return

    if (!guild.me.permissions.has("MANAGE_CHANNELS")) {
      try {
        return functions.sendbotlogs(guild, {
          title: `Anti-Nuke Dangerous Permissions Added`,
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
          title: `Anti-Nuke Dangerous Permissions Added`,
          description: `Im Missing Permissions: \`MANAGE_MEMBERS\``,
          color: "DARK_BUT_NOT_BLACK"
        })
      } catch (err) {
        return
      }
    }

    let dangerous_permissions = ["ADMINISTRATOR", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MEMBERS", "MODERATE_MEMBERS", "MANAGE_GUILD"]
    let check = newrole.permissions.toArray().some(p => dangerous_permissions.includes(p))
    if (check == true) {
      
      let quarantined = functions.quarantine(member)
      if (quarantined !== true) {
        if (member.user.bot) {
          functions.sendbotlogs(guild, {
            title: `Anti-Nuke Dangerous Permissions Added`,
            description: `Quarantine Role Does Not Exist/Not Set, Trying To Ban Bot Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
            color: "DARK_BUT_NOT_BLACK"
          })
          guild.bans.create(member, {
            reason: `Added Dangerous Permissions To ${role.name}`
          }).then(async () => {
            await functions.dont_save_roles(member)
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Dangerous Permissions Added`,
              description: `Quarantine Role Does Not Exist/Not Set, Banned Bot Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Bot: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
          }).catch(err => {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Dangerous Permissions Added`,
              description: `${err}\nTrying To Quarantine A User Failed Resorted To Banning Bot Also Failed: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
          })
          return;
        } else {
          functions.sendbotlogs(guild, {
            title: `Anti-Nuke Dangerous Permissions Added`,
            description: `Quarantine Role Does Not Exist/Not Set, Trying To Kick Member Instead...\nTrying To Quarantine A User: ${member.user.tag}`,
            color: "DARK_BUT_NOT_BLACK"
          })
          member.kick(`Added Dangerous Permissions To ${role.name}`).then(async () => {
            await functions.dont_save_roles(member)
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Dangerous Permissions Added`,
              description: `Quarantine Role Does Not Exist/Not Set, Kicked Member Instead...\nTrying To Quarantine A User Failed Resorted To Kicking Member: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
          }).catch(err => {
            functions.sendbotlogs(guild, {
              title: `Anti-Nuke Dangerous Permissions Added`,
              description: `${err}\nTrying To Quarantine A User Failed Resorted To Kicking Member Also Failed: ${member.user.tag}`,
              color: "DARK_BUT_NOT_BLACK"
            })
          })
          return;
        }
        return;
      }
      let oldperms = role.permissions.toArray()
      newrole.setPermissions(oldperms).catch(err => {
        functions.sendbotlogs(guild, {
          title: `Anti-Nuke Dangerous Permissions Added`,
          description: `${err}\nTrying To Remove Dangerous Permission From ${role}`,
          color: "DARK_BUT_NOT_BLACK"
        })
      })
      return functions.sendbotlogs(guild, {
        title: `Anti-Nuke Dangerous Permissions Added`,
        description: `Quarantined User: ${member.user.tag}\nAdded Dangerous Permissions To ${role}`,
        color: "DARK_BUT_NOT_BLACK"
      })

    }

  },
};

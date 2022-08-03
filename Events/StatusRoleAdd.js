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

function getguild(member) {
  try {
    let guild = member.guild
    return guild
  } catch (err) {
    return false
  }
}

module.exports = {
  name: "presenceUpdate",
  once: false,
  async execute(oldMember, newMember) {
    let guild = getguild(oldMember)
    if(!guild) return
    let data = await gdb.findOne({
      _id: guild.id
    })
    if (!data || data.status_role == false || data.status_roles.length == 0 || oldMember.user.bot || data.status_message == "" || data.status_message == null) return
    if(oldMember.user.id == client.user.id) return;
    if (!guild.me.permissions.has("MANAGE_ROLES")) {
      try {
        return functions.sendbotlogs(guild, {title: `Status Role`, description: `Im Missing Permissions: \`MANAGE_ROLES\`\nTrying To Add A Status Role(s) To A User: ${oldMember.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
      } catch (err) {
        return
      }
    }
    
    
    let status = newMember.activities.map(a => a.state)
    if (!status) return;
    const member = guild.members.cache.get(newMember.user.id);
    if(!member) return;
    if (status[0] && status[0] !== null) {

      if (status[0].toLowerCase().includes(data.status_message)) {
        for (let id of data.status_roles) {
          let role = guild.roles.cache.get(id)
          if (!role) {
            continue
          }

          try {
            member.roles.add(role, `${member.user.tag} has ${data.status_message} in their status`).catch(err => {
              return
            })
          } catch (err) {
            continue
          }
        }
      }

    } else {
      for (let id of data.status_roles) {
        let role = guild.roles.cache.get(id)
        if (!role) {
          continue
        }

        try {
          member.roles.remove(role, `${member.user.tag} removed ${data.status_message} from their status`).catch(err => {
            return
          })
        } catch (err) {
          continue
        }
      }
    }

  },
};
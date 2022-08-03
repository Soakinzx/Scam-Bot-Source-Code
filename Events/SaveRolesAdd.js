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
    let gdata = await functions.getdb(gdb, {
      _id: member.guild.id
    })
    if (!gdata || gdata.save_roles == false) return;

    let data = await functions.getdb(urdb, {
      _uid: member.id,
      _gid: member.guild.id
    })
    if (!data) return
    if(member.id == client.user.id || member.user.bot) return;
    if (!member.guild.me.permissions.has("MANAGE_ROLES")) {
      try {
        return functions.sendbotlogs(member.guild, {title: `Save User Roles`, description: `Im Missing Permissions: \`MANAGE_ROLES\`\nTrying To Add A Role(s) Saved By ${client.user.username} To A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
      } catch (err) {
        return
      }
    }
    
    for (let id of data.roles) {
      let role = member.guild.roles.cache.get(id)
      if (!role) return
      try {
        member.roles.add(role, `${client.user.username} auto save roles enabled`).catch(err => {
          return functions.sendbotlogs(member.guild, {title: `Save User Roles`, description: `${err}\nTrying To Add A Role Saved By ${client.user.username} To A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
        })
      } catch (err) {
        return functions.sendbotlogs(member.guild, {title: `Save User Roles`, description: `${err}\nTrying To Add A Role Saved By ${client.user.username} To A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
      }
    }
    await urdb.findOneAndDelete({
      _uid: member.id,
      _gid: member.guild.id
    })

  },
};
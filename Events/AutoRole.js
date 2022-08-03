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
module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
      let gdata = await functions.getdb(gdb, {
        _id: member.guild.id
      })
      
      if (!gdata || gdata.auto_role == false || gdata.auto_roles.length == 0) return;
      if(member.id == client.user.id || member.user.bot) return;
      if(!member.guild.me.permissions.has("MANAGE_ROLES")){
        try{
          return functions.sendbotlogs(member.guild, {title: `Auto Role`, description: `Im Missing Permissions: \`MANAGE_ROLES\`\nTrying To Add A Auto Role To A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
        } catch(err){
          return
        }
      }
      
      for(let id of gdata.auto_roles){
        let role = member.guild.roles.cache.get(id)
        if(!role) return;
        try{
          member.roles.add(role, `${client.user.username} auto role enabled`).catch(err => {
            return functions.sendbotlogs(member.guild, {title: `Auto Role`, description: `${err}\nTrying To Add A Auto Role \`${role.name}\` To A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
          })
        } catch (err){
          return functions.sendbotlogs(member.guild, {title: `Auto Role`, description: `${err}\nTrying To Add A Auto Role \`${role.name}\` To A User: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
        }
      }
    },
};
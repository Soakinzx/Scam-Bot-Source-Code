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
    name: "guildMemberRemove",
    once: false,
    async execute(member) {
        let gdata = await functions.getdb(gdb, {
            _id: member.guild.id
        })
        if (!gdata || gdata.save_roles == false) return;

      let data = await functions.getdb(urdb, {_uid: member.id, _gid: member.guild.id})
      if(data){
        await urdb.findOneAndDelete({_uid: member.id, _gid: member.guild.id}).catch(err => {return;})
      }
      let roles = member.roles.cache.filter(role => role.name !== "@everyone").map(role => role.id)
      data = new urdb({
        _uid: member.id,
        _gid: member.guild.id,
        roles: roles
      })
      data.save()
    },
};
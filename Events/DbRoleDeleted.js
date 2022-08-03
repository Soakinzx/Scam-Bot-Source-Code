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
    name: "roleDelete",
    once: false,
    async execute(role) {
      let data = await functions.getdb(gdb, {
        _id: role.guild.id
      })
      if (!data || (data.auto_roles.length == 0 && data.status_roles.length == 0)) return;
      if(data.auto_roles.includes(role.id)){
        data.auto_roles.splice(data.auto_roles.indexOf(role.id), 1)
      }
      if(data.status_roles.includes(role.id)){
        data.status_roles.splice(data.status_roles.indexOf(role.id), 1)
      }
      if(data.whitelistrole == role.id){
        data.whitelistrole = null
      }
      if(data.trustrole == role.id){
        data.trustrole = null
      }
      
      data.save()
    },
};
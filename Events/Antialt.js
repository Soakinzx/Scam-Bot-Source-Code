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
      let guild = member.guild
      let gdata = await functions.getdb(gdb, {
        _id: guild.id
      })
      
      if (!gdata || gdata.antialt == false || gdata.whitelisted.includes(member.id) || member.roles.cache.has(gdata.whitelistrole) || gdata.trusted.includes(member.id) || member.roles.cache.has(gdata.trustrole)) return;
      let owner = functions.getowner(guild)
      if(member.id == client.user.id) return;
      if(!guild) return;
      if(!guild.me.permissions.has("KICK_MEMBERS")){
        try{
          return functions.sendbotlogs(guild, {title: `Anti-Alt`, description: `Im Missing Permissions: \`KICK_MEMBERS\`\nTrying To Kick: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
        } catch(err){
          return
        }
      }
      

      if(Date.now() - member.user.createdAt < 1000*60*60*24*5){
         member.kick(`Antialt enabled account must be atleast 5 days old`).catch(err => {
           return functions.sendbotlogs(guild, {title: `Anti-Alt`, description: `${err}\nTrying To Kick: ${member.user.tag}`, color: "DARK_BUT_NOT_BLACK"})
         })
      }
      
    },
};
const db = require("../Models/Guild")
const Discord = require("discord.js")
let functions = require("../functions.js")
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
const moment = require("moment")
module.exports = {
    name: "guildMemberUpdate",
    once: false,
    async execute(oldMember, newMember) {
        let guild = oldMember.guild
        if (!guild) return;
        
        let data = await functions.getdb(db, {_id: guild.id})
        
        if(!data) return
        let find_lost = data.boosters_lost.find(d => d.id == oldMember.id)
        if(find_lost && newMember.premiumSinceTimestamp !== null){
            data.boosters_lost.splice(find_lost,1)
        } else if(!find_lost && oldMember.premiumSinceTimestamp !== null && newMember.premiumSinceTimestamp == null){
            data.boosters_lost.push({id: oldMember.id, date: Date.now()})
        }
        data.save()
        //.premiumSinceTimestamp
        
    },
};

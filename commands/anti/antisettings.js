const {
  WelcomeScreen
} = require("discord.js");
const Discord = require("discord.js")
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require("discord.js");


module.exports = {
  name: "antisettings",
  category: "anti",
  aliases: [],
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$antisettings"],
  description: "see server anti settings",
  run: async (client, message, args) => {

    let functions = require("../../functions.js")
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    let gdb = require("../../Models/Guild")

    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data) {
      data = new gdb(gs)
      data.save()
    }

    function determine(bool) {
      let obj = {
        true: "<:scambot_toggle_on:1005586188343713843>",
        false: "<:scambot_toggle_on:1005586189107089520>",
        "premium": "<:scambot_toggle_premium:1005586187513253959>"
      }
      return obj[bool]
    }

    let embed = new MessageEmbed()
      .setTitle(`${message.guild.name} Anti Settings(updating very soon...)`)
      .setColor("DARK_BUT_NOT_BLACK")
      .setColor("DARK_BUT_NOT_BLACK")
      .addField("Anti Nuke", `Status: ${determine(data.antinuke)}`, true)
      .addField("Anti Alt", `Status: ${determine(data.antialt)}`, true)
      .addField("Anti Bot", `Status: ${determine(data.antibot)}`, true)
      .addField("Anti Join", `Status: ${determine(data.antijoin)}`, true)
      .addField("Anti Link", `Status: ${determine(data.antilink)}`, true)
      .addField("Anti Message", `Messages Per Time: ${data.antimessage_mps}\nTime: ${data.antimessage_seconds}s\nStatus: ${determine(data.antimessage)}`, true)
    return message.reply({
      embeds: [embed]
    })
  },
};
/*
.addField("Logs Channel", `\`\`\`${logs_channel}\`\`\``, true)
*/

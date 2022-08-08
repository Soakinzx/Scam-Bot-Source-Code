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
  name: "antinukesettings",
  category: "anti",
  aliases: [],
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$antinukesettings"],
  description: "see server anti nuke settings",
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
    let json = data.antinukesettings
    let embed = new MessageEmbed()
      .setTitle(`${message.guild.name} Anti Nuke Settings`)
      .setColor("DARK_BUT_NOT_BLACK")
      .setColor("DARK_BUT_NOT_BLACK")
      .addField("Anti Nuke", `Status: ${determine(data.antinuke)}`, true)
      .addField("Anti Nuke Settings", `${functions.text_block(`Channels Deleted Before Time: ${json["channels_deleted_before_time_before_quarantine"]}\nChannels Deleted Time: ${json["channels_deleted_time"]}s\n\nChannels Created Before Time: ${json["channels_created_before_time_before_quarantine"]}\nChannels Created Time: ${json["channels_created_time"]}s\n\nRoles Created Before Time: ${json["roles_created_before_time_before_quarantine"]}\nRoles Created Time: ${json["roles_created_time"]}s\n\nRoles Deleted Before Time: ${json["roles_deleted_before_time_before_quarantine"]}\nRoles Deleted Time: ${json["roles_deleted_time"]}s\n\nMembers Kicked Before Time: ${json["members_kicked_before_time_before_quarantine"]}\nMembers Kicked Time: ${json["members_kicked_time"]}s\n\nMembers Banned Before Time: ${json["members_banned_before_time_before_quarantine"]}\nMembers Banned Time: ${json["members_banned_time"]}s\n\nQuarantine/kick/ban On Dangerous Permissions Added: ${json["quarantine_on_dangerous_permissions_added"]}`)}`, true)
    return message.reply({
      embeds: [embed]
    })
  },
};
/*
.addField("Logs Channel", `\`\`\`${logs_channel}\`\`\``, true)
*/

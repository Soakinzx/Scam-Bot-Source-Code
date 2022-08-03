const { WelcomeScreen } = require("discord.js");
const Discord = require("discord.js")
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require("discord.js");


module.exports = {
  name: "serversettings",
  category: "info",
  aliases: ["serversetting", "serverconfig"],
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$serversettings"],
  description: "see server custom settings",
  run: async (client, message, args) => {
    let prefix;
    let functions = require("../../functions.js")
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    let gdb = require("../../Models/Guild")
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      data = new gdb(gs)
      data.save()
    }
    
    if (!data || data.prefix == null) {
      prefix = "$"
    } else {
      prefix = data.prefix
    }
    let jtc = message.guild.channels.cache.get(data.jtc)
    if(!jtc){
      jtc = "Not Set"
    } else {
      jtc = "#" + jtc.name
    }
    let whitelisted_role = message.guild.roles.cache.get(data.whitelistrole)
    if(!whitelisted_role){
      whitelisted_role = "Not Set"
    } else {
      whitelisted_role = whitelisted_role.name
    }
    let trusted_role = message.guild.roles.cache.get(data.trustrole)
    if(!trusted_role){
      trusted_role = "Not Set"
    } else {
      trusted_role = trusted_role.name
    }
    let quarantine_role = message.guild.roles.cache.get(data.quarantinerole)
    if(!quarantine_role){
      quarantine_role = "Not Set"
    } else {
      quarantine_role = quarantine_role.name
    }
    
    let welcome_channel = message.guild.channels.cache.get(data.welcome_channel)
    if(!welcome_channel){
      welcome_channel = "Not Set"
    } else {
      welcome_channel = "#" + welcome_channel.name
    }
let logs_channel = message.guild.channels.cache.get(data.logs_channel)
    if(!logs_channel){
      logs_channel = "Not Set"
    } else {
      logs_channel = "#" + logs_channel.name
    }
    
    let embed = new MessageEmbed()
      .setTitle(`${message.guild.name} Custom Settings`)
      .setColor("DARK_BUT_NOT_BLACK")
      .addField("Prefix", `\`\`\`${prefix}\`\`\``, true)
      .addField("PokeHelper", `\`\`\`${(data.pokehelper) ? "Enabled" : "Disabled"}\`\`\``, true)
      .addField("Join To Create", `\`\`\`${jtc}\`\`\``, true)
      .addField("Welcome Channel", `\`\`\`${welcome_channel}\`\`\``, true)
      .addField("Welcome Message", `\`\`\`\n${JSON.stringify(data.welcome_message, null, 2)}}\`\`\``, true)
      
      .addField("Auto Role", `\`\`\`${(data.auto_role) ? "Enabled" : "Disabled"}\`\`\``, true)
      .addField("Auto Roles", `\`\`\`${data.auto_roles.length}\`\`\``, true)
      .addField("Status Role", `\`\`\`${(data.status_role) ? "Enabled" : "Disabled"}\`\`\``, true)
      .addField("Status Roles", `\`\`\`${data.status_roles.length}\`\`\``, true)
      .addField("Status Message", `\`\`\`${data.status_message || "Not Set"}\`\`\``, true)
      .addField("Anti-Alt", `\`\`\`${data.antialt}\`\`\``, true)
      .addField("Anti-Bot", `\`\`\`${data.antibot}\`\`\``, true)
      .addField("Anti-Join", `\`\`\`${data.antijoin}\`\`\``, true)
      .addField("Anti-Link", `\`\`\`${data.antilink}\`\`\``, true)
      .addField("Anti-Message", `\`\`\`\n${data.antimessage}\nTime: ${data.antimessage_seconds}\nMessages Per Time: ${data.antimessage_mps}\`\`\``, true)
      .addField("Anti-Nuke", `\`\`\`${data.antinuke}\`\`\``, true)
      .addField("Anti-Nuke Settings", `\`\`\`${JSON.stringify(data.antinukesettings, null, 2)}\`\`\``, true)
      .addField("Quarantine Role", `\`\`\`${quarantine_role}\`\`\``, true)
      .addField("Trusted Users", `\`\`\`${data.trusted.length}\`\`\``, true)
      .addField("Trusted Role", `\`\`\`${trusted_role}\`\`\``, true)
      .addField("Whitelisted Users", `\`\`\`${data.whitelisted.length}\`\`\``, true)
      .addField("Whitelisted Role", `\`\`\`${whitelisted_role}\`\`\``, true)
      .addField("Blacklisted Users", `\`\`\`${data.blacklisted.length}\`\`\``, true)
      .addField("Save Roles", `\`\`\`${(data.save_roles) ? "Enabled" : "Disabled"}\`\`\``, true)
      .addField("Auto Responds", `\`\`\`${data.Autorespond_messages.length}\`\`\``, true)
      .addField("Auto Untimout Toggled Users", `\`\`\`${data.toggletimeout_list.length}\`\`\``, true)
      .setColor("DARK_BUT_NOT_BLACK")
    return message.reply({
      embeds: [embed]
    })
  },
};
/*
.addField("Logs Channel", `\`\`\`${logs_channel}\`\`\``, true)
*/
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
let discord = require("discord.js")
const client = require("../../index.js");


function convert(date) {
  let ms = (Date.now() - date)
  let secs = Math.floor(ms / 1000)
  let mins = Math.floor(secs / 60)
  let hours = Math.floor(mins / 60)
  let days = Math.floor(hours / 24)
  secs %= 60;
  mins %= 60;
  hours %= 24;
  return `${days}d ${hours}h ${mins}m ${secs}s`
}

function format(string) {
  let parts = string.split(" ")
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase()
  }
  string = parts.join(" ")
  return string
}
let functions = require("../../functions.js")
module.exports = {
  name: "roleinfo",
  aliases: ["ri"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$roleinfo <role>"],
  category: "info",
  description: "fetches info about a role",
  run: async (client, message, args) => {
    const offSwitch = client.emojis.cache.find(
      (ee) => ee.id === "988497460353724506"
    );

    const onSwitch = client.emojis.cache.find(
      (e) => e.id === "988497446336339988"
    );
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(r => r.name.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.member.roles.highest
    let perms = role.permissions.toArray().map(perm => format(perm.replace(/_/g, " ")))
    let embed = new MessageEmbed()
      .setTitle(`${role.name} info`)
      .setColor(role.hexColor)
      .addField("ID", functions.text_block(`${role.id}`), true)
      .addField("Color", functions.text_block(`${role.hexColor}`), true)
      .addField("Mentionable", functions.text_block(`${role.mentionable}`), true)
      .addField("Managed", functions.text_block(`${role.managed}`), true)
      .addField("Hoisted", functions.text_block(`${role.hoist}`), true)
      .addField("Position", functions.text_block(`${role.position}`), true)
      .addField("Members", functions.text_block(`${role.members.size}`), true)
      .addField("Created", functions.text_block(`${role.createdAt.toLocaleDateString()} | ${convert(role.createdTimestamp)}`), true)
      .addField("Permissions", functions.text_block(`${(perms.length > 0) ? perms : "None"}`), true)
      .setFooter(`${role.id}`)
      .setTimestamp()



    if (role.iconURL() !== null) {
      embed.setThumbnail(role.iconURL())
    }
    if (role.unicodeEmoji != null) {
      embed.addField("Emoji Unicode", functions.text_block(`${role.unicodeEmoji}`), true)
    }
    let row = new MessageActionRow().addComponents(
      new MessageButton()
      .setStyle("SECONDARY")
      .setLabel("In Role?")
      .setCustomId("inrole")
    )
    let msg = await message.reply({
      embeds: [embed],
      components: [row]
    })

    let collector = msg.createMessageComponentCollector({
      type: "BUTTON"
    })
    let members = (role.members.map(m => `\`${m.user.username}\``).join(", ").length > 4050) ? role.members.map(m => `\`${m.user.username}\``).join(", ").slice(0,4050) + "...Too Many To Display" : role.members.map(m => `\`${m.user.username}\``).join(", ")
    function inrole(i) {
      let embed = new MessageEmbed()
      .setTitle(`Members in ${role.name}`)
      .setDescription(members)
      return i.reply({embeds: [embed], ephemeral: true})
      
    }
    collector.on("collect", async i => {
      if (i.customId == "inrole") {
        inrole(i)
      }
    })
  },
}
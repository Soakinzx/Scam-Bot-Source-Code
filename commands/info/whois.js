const {
  MessageEmbed,
  GuildMember,
  Client
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

module.exports = {
  name: "whois",
  aliases: ["who", "userinfo", "wi", "ui"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$whois <optional: user>"],
  category: "info",
  description: "fetches info about a user",
  run: async (client, message, args) => {
    const offSwitch = client.emojis.cache.find(
      (ee) => ee.id === "988497460353724506"
    );

    const onSwitch = client.emojis.cache.find(
      (e) => e.id === "988497446336339988"
    );
    if(!args[0]){
      args[0] = "None"
    }
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(i => i.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || client.users.cache.find(i => i.tag.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.author
    const avatar = user.displayAvatarURL();
    let bot;
    if (!user.bot) {
      bot = offSwitch;
    } else {
      bot = onSwitch;
    }

    const flags = user.flags.toArray();
    const badg = flags.join(" ");
    let house_balance = client.emojis.cache.get("988497445031915640");
    let house_bravery = client.emojis.cache.get("988497459632283778");
    let house_brilliance = client.emojis.cache.get("988497458860552243");
    let badges = [];
    if (badg === "HOUSE_BALANCE") {
      badges.push(house_balance);
    } else if (badg === "HOUSE_BRAVERY") {
      badges.push(house_bravery);
    } else if (badg === "HOUSE_BRILLIANCE") {
      badges.push(house_brilliance);
    }

    const inServer = message.guild.members.cache.get(user.id);
    let inserver;
    if (!inServer) {
      inserver = offSwitch;
      const embed = new MessageEmbed()
        .setColor("DARK_BUT_NOT_BLACK")
        .setAuthor(`${user.tag}`, avatar)
        .setDescription(`<@${user.id}> - ` + `[Avatar Link](${avatar})`)
        .addFields({
          name: "Account",
          value: `**Joined discord:** **\`${user.createdAt.toLocaleDateString()} | ${convert(user.createdAt)}\`**\n**Bot:** ${bot}\n**In Server:** ${inserver}\n**House badge:** ${badges.join(
            " "
          )}`,
        })
        .setFooter(`User ID: ${user.id}`, avatar)
        .setTimestamp();

      message.reply({
        embeds: [embed]
      });
    } else {
      inserver = onSwitch;
      const member = message.mentions.members.first() || message.member;
      let discord_perms = Object.keys(discord.Permissions.FLAGS)
      let permissions = []
      
      for (let perm of discord_perms) {
        
        if (member.permissions.has(perm)) {
          permissions.push(format(perm.replace(/_/g, " ")))
        }
      }
      if (permissions.length == 0) {
        permissions = "None"
      } else {
        permissions = permissions.join(", ")
        if(permissions.length > 1024){
          permissions = "Too Many To Display..."
        }
      }
      let roles = message.member.roles.cache.map(role => role)
      if(roles.length == 0){
        roles = "None"
      } else {
        roles = roles.join(", ")
        if(roles.length > 1024){
          roles = "Too Many To Display..."
        }
      }

      let nickname = member.nickname || "None";
      const embed = new MessageEmbed()
        .setAuthor(`${user.tag}`, avatar)
        .setDescription(`<@${user.id}> - ` + `[Avatar Link](${avatar})`)
        .addFields({
          name: "**Discord**",
          value: `**Joined discord:** **\`${user.createdAt.toLocaleDateString()} | ${convert(user.createdAt)}\`**\n**Bot:** ${bot}\n**In Server:** ${inserver}\n**House badge:** ${badges.join(
              " "
            )}`,
        }, {
          name: "**Server**",
          value: `**Joined Server:** **\`${member.joinedAt.toLocaleDateString()} | ${convert(member.joinedAt)}\`**\n**Nickname:** **\`${nickname}\`**\n**Roles:** **\`${
              member.roles.cache.size - 1
            }\`**`,
        }, {
          name: "\n**Permissions**",
          value: `\`${permissions}\``,
        }, {
          name: "**Roles**",
          value: `${roles}`,
        })
        .setFooter(`User ID: ${user.id}`, avatar)
        .setTimestamp();

      message.reply({
        embeds: [embed]
      });
    }
  },
}
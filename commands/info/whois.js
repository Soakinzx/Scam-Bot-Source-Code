const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
let discord = require("discord.js");
const client = require("../../index.js");

function convert(date) {
  let ms = Date.now() - date;
  let secs = Math.floor(ms / 1000);
  let mins = Math.floor(secs / 60);
  let hours = Math.floor(mins / 60);
  let days = Math.floor(hours / 24);
  secs %= 60;
  mins %= 60;
  hours %= 24;
  return `${days}d ${hours}h ${mins}m ${secs}s`;
}

function format(string) {
  string = string.replaceAll("_", " ")
  let parts = string.split(" ");
  for (let i = 0; i < parts.length; i++) {
    parts[i] =
      parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase();
  }
  string = parts.join(" ");
  return string;
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
    const offSwitch = "<:scambot_toggle_off:1005586189107089520>";

    const onSwitch = "<:scambot_toggle_on:1005586188343713843>";
    if (!args[0]) {
      args[0] = message.author.id;
    }
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find((i) =>
        i.user.username.toLowerCase().startsWith(args.join(" ").toLowerCase())
      ) ||
      message.guild.members.cache.find((i) =>
        i.user.tag.toLowerCase().startsWith(args.join(" ").toLowerCase())
      ) ||
      message.member;

    const flags = member.user.flags.toArray();
    let house_balance = client.emojis.cache.get("988497445031915640");
    let house_bravery = client.emojis.cache.get("988497459632283778");
    let house_brilliance = client.emojis.cache.get("988497458860552243");
    let badges = [];
    if (flags.includes("HOUSE_BALANCE")) {
      badges.push(house_balance);
    } else if (flags.includes("HOUSE_BRAVERY")) {
      badges.push(house_bravery);
    } else if (flags.includes("HOUSE_BRILLIANCE")) {
      badges.push(house_brilliance);
    }
    let row = new MessageActionRow();
    row.components.push(
      new discord.MessageButton()
        .setStyle("LINK")
        .setLabel("Avatar")
        .setURL(
          member.user.displayAvatarURL({ size: 4096, dynamic: true})
        )
    );
    let banner = await member.user.fetch(member.banner)
    if (banner.bannerURL()) {
      row.components.push(
        new discord.MessageButton()
          .setStyle("LINK")
          .setLabel("Banner")
          .setURL(banner.bannerURL({ size: 4096, dynamic: true }))
      );
    }
    if (member.displayAvatarURL() !== member.user.displayAvatarURL()) {
      row.components.push(
        new discord.MessageButton()
          .setStyle("LINK")
          .setLabel("Server Avatar")
          .setURL(member.displayAvatarURL({ size: 4096, dynamic: true }))
      );
    }
    let nickname = member.nickname || "None";
    let roles = member.roles.cache
      .filter((r) => r.name !== "@everyone")
      .map((r) => r);
    let perms = member.permissions.toArray().map(p => `\`${format(p)}\``)
    let embed = new MessageEmbed()
      .setTitle(`${member.user.tag}'s Info`)
      .setTimestamp()
      .setColor(member.displayHexColor)
      .addFields([
        {
          name: "Discord",
          value: `<:scambot_reply2:1007492305726484550>**Account Created:** \`${member.user.createdAt.toLocaleDateString()}(${convert(
            member.user.createdAt
          )})\`\n<:scambot_reply2:1007492305726484550>**Badges(${
            badges.length
          }):** ${
            badges.join(" ") || "None"
          }\n<:scambot_reply:988497454120980500>**Bot:** ${
            member.user.bot ? onSwitch : offSwitch
          }`,
          inline: true,
        },
        {
          name: "Server",
          value: `<:scambot_reply2:1007492305726484550>**Joined Server:** \`${member.joinedAt.toLocaleDateString()}(${convert(
            member.joinedAt
          )})\`\n<:scambot_reply:988497454120980500>**Nickname:** \`${nickname})\``,
          inline: true,
        },
        {
          name: `Roles(${roles.length})`,
          value: `${
            (roles.join(" ").length > 1024
              ? "`Too Many Roles Too Display`"
              : roles.join(" ")) || "`None`"
          }`,
          inline: true,
        },
        {
          name: `Permissions(${perms.length})`,
          value: `${
            (perms.join(" ").length > 1024
              ? "`Too Many Permissions Too Display`"
              : perms.join(" ")) || "`None`"
          }`,
          inline: true,
        },
      ])
      .setFooter({
        text: `${member.id}`,
        iconURL: `${member.displayAvatarURL({ dynamic: true })}`,
      });

    return message.channel.send({ embeds: [embed], components: [row] });
  },
};

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
  let parts = string.replaceAll("_", " ").split(" ")
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase()
  }
  string = parts.join(" ")
  return string
}
const {
  MessageEmbed
} = require("discord.js");
let discord = require("discord.js")
let functions = require("../../functions.js")
module.exports = {
  name: "serverinfo",
  aliases: ["si", "server"],
  category: "info",
  permission: [],
  req_perms: [],
  usage: ["$serverinfo"],
  description: "fetches info about the server",
  run: async (client, message, args, config) => {
    let max_stickers = 5
    let max_emojis = 50
    let vanityurl = "None"
    let vanityurluses = "0"
      let tier = (message.guild.premiumTier == "NONE") ? "TIER_0" : message.guild.premiumTier
      if(tier == "TIER_1") {
        max_stickers = 15
        max_emojis = 100
      }
      if(tier == "TIER_2") {
        max_stickers = 30
        max_emojis = 150
      }
      if(tier == "TIER_3") {
        max_stickers = 60
        max_emojis = 250
        let vd = await message.guild.fetchVanityData()
        if(vd.code) {
            vanityurl = `.gg/${vd.code}`
        }
        if(vd.uses) {
            vanityurluses = `${vd.uses}`
        }
      } else {
          vanityurl = "Server Not Level 3"
          vanityurluses = "Server Not Level 3"
      }
    
    const mct = message.guild.memberCount;
    const name = message.guild.name;
    let ServerLogo = message.guild.iconURL({dynamic: true});
    const member = message.guild.members.cache.get(message.guild.id);
    let arr = [];
    let emoji;
    if (message.guild.emojis.cache.size >= 1) {
      message.guild.emojis.cache.map((e) => {
        arr.push(e.toString());
      })
      if (arr.join(" ").length > 1024) {
        emoji = functions.text_block("Too many emojis to display");
      } else {
        emoji = arr.join("ㅤ");
      }
    } else {
      emoji = "ㅤ";
    }
    let arr2 = [];
    message.guild.roles.cache.map((r) => {
      arr2.push(r.toString());
    });
    let roles;
    if (arr2.join(" ").length > 1024) {
      roles = functions.text_block("Too many roles to display");
    } else {
      roles = arr2.join(" ");
    }
    let row = new discord.MessageActionRow()
    if (ServerLogo === null) {
      ServerLogo =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUx6eob1dJoeLmmCNqWjNw-khBZSmGWa5MFg&usqp=CAU";
      
    } else {
      row.components.push(new discord.MessageButton().setStyle("LINK").setLabel("Server Logo").setURL(ServerLogo))
    }
    
    

    const embed = new MessageEmbed()
      .setTitle("Server info")
      .setDescription(message.guild.description || "No Description")
      .setColor("DARK_BUT_NOT_BLACK")
      .setImage(ServerLogo)
      .addFields(
        {
        name: "Name And Owner",
        value: `<:scambot_reply2:1007492305726484550>**Name:** \`${name}\`\n<:scambot_reply:988497454120980500>**Owner:** \`${message.guild.members.cache.get(message.guild.ownerId).user.tag}\``,
          inline: true
        }, 
        {
          name: "Channels",
          value: `<:scambot_reply2:1007492305726484550>**Text Channels:** \`${message.guild.channels.cache.filter(c => c.type == "GUILD_TEXT").size}\`\n<:scambot_reply2:1007492305726484550>**Voice Channels:** \`${message.guild.channels.cache.filter(c => c.type == "GUILD_VOICE").size}\`\n<:scambot_reply2:1007492305726484550>**Categories:** \`${message.guild.channels.cache.filter(c => c.type == "GUILD_CATEGORY").size}\`\n<:scambot_reply:988497454120980500>**Total:** \`${message.guild.channels.cache.size}\``,
          inline: true
        },
        {
          name: "Members",
          value: `<:scambot_reply2:1007492305726484550>**Humans:** \`${message.guild.members.cache.filter(m => !m.user.bot).size}\`\n<:scambot_reply2:1007492305726484550>**Bots:** \`${message.guild.members.cache.filter(m => m.user.bot).size}\`\n<:scambot_reply:988497454120980500>**Total:** \`${message.guild.members.cache.size}\``,
          inline: true
        },
        {
          name: "Created",
          value: `<:scambot_reply2:1007492305726484550>**Formatted Date:** \`${message.guild.createdAt.toLocaleDateString("en-US")}\`\n<:scambot_reply:988497454120980500>**In DD/HH/MM/SS:** \`${convert(message.guild.createdAt)}\``,
          inline: true
        },
        {
          name: "Miscellaneous",
          value: `<:scambot_reply2:1007492305726484550>**Roles:** \`${message.guild.roles.cache.size}/250\`\n<:scambot_reply2:1007492305726484550>**Non-Animated Emojis:** \`${message.guild.emojis.cache.filter(e => !e.animated).size}/${max_emojis}\`\n<:scambot_reply2:1007492305726484550>**Animated Emojis:** \`${message.guild.emojis.cache.filter(e => e.animated).size}/${max_emojis}\`\n<:scambot_reply:988497454120980500>**Stickers:** \`${message.guild.stickers.cache.size}/${max_stickers}\``,
          inline: true
        },
        {
          name: "Boosts",
          value: `<:scambot_reply2:1007492305726484550>**Tier:** \`${format(tier.replace(/_/g, " ")).split(" ")[1]}\`\n<:scambot_reply:988497454120980500>**Boosts:** \`${message.guild.premiumSubscriptionCount}\``
        },
        {
          name: "Vanity",
          value: `<:scambot_reply2:1007492305726484550>**Vanity URL:** \`${vanityurl}\`\n<:scambot_reply:988497454120980500>**Vanity URL Uses:** \`${vanityurluses}\``,
          inline: true
        },
        {
          name: "General",
          value: `<:scambot_reply2:1007492305726484550>**NSFW Level:** \`${message.guild.nsfwLevel}\`\n<:scambot_reply2:1007492305726484550>**MFA Level:** \`${message.guild.mfaLevel}\`\n<:scambot_reply2:1007492305726484550>**Verification Level:** \`${message.guild.verificationLevel}\`\n<:scambot_reply2:1007492305726484550>**Verified:** \`${message.guild.verified}\`\n<:scambot_reply2:1007492305726484550>**Max Members:** \`${message.guild.maximumMembers}\`\n<:scambot_reply2:1007492305726484550>**Max Bitrate:** \`${message.guild.maximumBitrate}\`\n<:scambot_reply2:1007492305726484550>**Content Filter:** \`${message.guild.explicitContentFilter
}\`\n<:scambot_reply:988497454120980500>**Default Notifications:** \`${format(message.guild.defaultMessageNotifications
)}\``
        },
        {
          name: `Features(${message.guild.features.length})`,
          value: functions.text_block(`${(message.guild.features.length) ? format(message.guild.features.join(", ")) : "None"}`),
          inline: true
        },
        {
        name: `Roles(${message.guild.roles.cache.size - 1})`,
        value: `${roles}`,
          inline: true
        },
        {
        name: `Emojis(${message.guild.emojis.cache.size})`,
        value: `${emoji}`,
        inline: true
        },
        {
        name: "\u200B",
        value: `[Click me!](${ServerLogo})`
        }
      )
      .setFooter(`${message.guild.id}`, ServerLogo)
      .setTimestamp(Date.now());
    if(message.guild.bannerURL())
    {
      embed.setThumbnail(message.guild.bannerURL({dynamic: true}))
      row.components.push(new discord.MessageButton().setStyle("LINK").setLabel("Server Banner").setURL(message.guild.bannerURL({dynamic: true})))
    }
    if(message.guild.splashURL())
    {
      row.components.push(new discord.MessageButton().setStyle("LINK").setLabel("Server Invite Banner").setURL(message.guild.splashURL({size: 4096, dynamic: true, format: "webp"})))
    }      
    
    
    if(row.components.length >= 1){
      message.channel.send({
      embeds: [embed],
      components: [row]
    });
    } else {
      message.channel.send({
      embeds: [embed]
    });
    }
  },
}

//member prune

//redo
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("./json/config.json");
const moment = require("moment");
const client = new Discord.Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "USER", "REACTION"],
});
const functions = require("./functions.js");
const fs = require("fs");
const gdb = require("./Models/Guild");
const Enmap = require("enmap");

const { Api } = require("@top-gg/sdk");
client.topgg = new Api(config.topgg_token, this);

client.commands = new Discord.Collection();
client.owners = [
  "849288765482598480",
  "765201883157495860",
  "957819187936518217",
];
client.ingame = [];
client.vote_required = [
  "holiday",
  "tiktok",
  "instagramprofile",
  "instagrampost",
  "texttospeech",
  "tutorial",
  "setstatusrole",
  "setpokehelper",
  "anti",
];
client.tum = [];
client.invite_link =
  "https://discord.com/oauth2/authorize?client_id=877168141355065404&permissions=1240658865402&scope=bot";
client.vote_link = "https://top.gg/bot/877168141355065404";
client.server_link = "https://discord.gg/erasedx";
(client.editing_welcome = []), (client.editing_leave = []);
client.clashroyale_api_key =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImE1MmRlMTc4LWNhZjctNDg5NC04NTFiLTkxYTljMDFkMWM3MCIsImlhdCI6MTY2MTA2MTkzMCwic3ViIjoiZGV2ZWxvcGVyL2YzMTNjOGIxLTZmY2UtZTAzMy1mYTE4LWU0MWNhN2MxYmRkMSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1LjE2MS4xNDkuMzIiXSwidHlwZSI6ImNsaWVudCJ9XX0.-aHopKUBrgLQnLH3YdwAtbkfIjuKTECz_gjltRit0DqyE_YiBUimPCNFzmyEqMvJ97GDOMnJh8mCj7XsRiHJ_w";
client.guild_schema = {
  _id: null,
  Autorespond_messages: [],
  toggletimeout_list: [],
  afk_list: [],
  sniped_message: {
    id: "",
    content: "",
  },
  prefix: "$",
  pokehelper: false,
  jtc: null,
  save_roles: false,
  welcome_channel: null,
  welcome_message: {
    content: "Welcome to {server.name} {user.name}",
    embed: {
      title: null,
      description: null,
      footer: {
        text: null,
        iconURL: null,
      },
      url: null,
      color: null,
      thumbnail: {
        url: null,
      },
      image: {
        url: null,
      },
      author: {
        name: null,
        iconURL: null,
      },
    },
    embed_enabled: false,
    text_enabled: true,
  },
  leave_channel: null,
  leave_message: {
    content: "Goodbye {user.name}!",
    embed: {
      title: null,
      description: null,
      footer: {
        text: null,
        iconURL: null,
      },
      url: null,
      color: null,
      thumbnail: {
        url: null,
      },
      image: {
        url: null,
      },
      author: {
        name: null,
        iconURL: null,
      },
    },
    embed_enabled: false,
    text_enabled: true,
  },
  last_joined: null,
  disabled_commands: [],
  logs_channel: null,
  log_events: {
    role_updated: true,
    member_kicked: true,
    member_banned: true,
    member_unbanned: true,
    member_left: true,
    member_updated: true,
    channel_created: true,
    channel_deleted: true,
    channel_updated: true,
    boost: true,
    emoji_created: true,
    emoji_deleted: true,
    emoji_edited: true,
    sticker_created: true,
    sticker_deleted: true,
    sticker_edited: true,
    server_updated: true,
    invite_created: true,
    invite_deleted: true,
    message_deleted: true,
    message_edited: true,
    purge: true,
    role_created: true,
    role_deleted: true,
    role_edited: true,
    thread_created: true,
    thread_deleted: true,
  },
  bot_logs_channel: null,
  auto_role: false,
  auto_roles: [],
  status_role: false,
  status_roles: [],
  status_message: "",
  blacklisted: [],
  antinuke: false,
  antinukesettings: {
    channels_deleted_before_time_before_quarantine: 1,
    channels_deleted_time: 5,
    channels_created_before_time_before_quarantine: 1,
    channels_created_time: 5,
    roles_deleted_before_time_before_quarantine: 1,
    roles_deleted_time: 5,
    roles_created_before_time_before_quarantine: 1,
    roles_created_time: 5,
    members_kicked_before_time_before_quarantine: 1,
    members_kicked_time: 5,
    members_banned_before_time_before_quarantine: 1,
    members_banned_time: 5,
    quarantine_on_dangerous_permissions_added: true,
  },
  antibot: false,
  antialt: false,
  antilink: false,
  antijoin: false,
  whitelisted: [],
  antimessage: false,
  antimessage_seconds: 10,
  antimessage_mps: 8,
  whitelistrole: null,
  trusted: [],
  trustrole: null,
  quarantinerole: null,
  boosters_lost: [],
};
client.user_schema = {
  birthday: {
    month: null,
    day: null,
  },
  timezone: null,
  marriage: {
    married_since: null,
    children: [],
  },
  name_history: [],
  tag_history: [],
};
client.userdb = new Enmap({
  name: "UserDb",
  dataDir: "./databases/UserDb",
});
//add antinukesettings, bot logs channel, quartine role to all fields
/*
db.guilds.updateMany({}, {$set: {antinukesettings: {
    channels_deleted_before_time_before_quarantine: 1,
    channels_deleted_time: 5,
    channels_created_before_time_before_quarantine: 1,
    channels_created_time: 5,
    roles_deleted_before_time_before_quarantine: 1,
    roles_deleted_time: 5,
    roles_created_before_time_before_quarantine: 1,
    roles_created_time: 5,
    members_kicked_before_time_before_quarantine: 1,
    members_kicked_time: 5,
    members_banned_before_time_before_quarantine: 1,
    members_banned_time: 5,
    quarantine_on_dangerous_permissions_added: true
  }}})
*/
//db.guilds.updateMany({}, {$set: {trustrole: null, trusted: []}})

module.exports = client;

client.once("ready", async () => {
  console.log("Client has Logged on!");
  client.user.setActivity(
    `${Math.round(client.users.cache.size / 1000) * 1000}+ Users`,
    {
      type: "STREAMING",
      url: "https://www.twitch.tv/boredisjustcool",
    }
  );
});
client.on("guildCreate", async (guild) => {
  if (!guild || !guild.name || !guild.ownerId) return;
  let lch = client.channels.cache.get("989039370491269160");
  lch.send({
    embeds: [
      {
        description: `Joined **${guild.name}** owned by **${
          guild.members.cache.get(guild.ownerId).user.tag
        }** with **${guild.members.cache.size}** members`,
        footer: { text: `ID: ${guild.id}` },
      },
    ],
  });
});

client.on("guildDelete", async (guild) => {
  if (!guild || !guild.name || !guild.ownerId) return;
  let lch = client.channels.cache.get("989039370491269160");
  lch.send({
    embeds: [
      {
        description: `Left **${guild.name}** owned by **${
          guild.members.cache.get(guild.ownerId).user.tag
        }** with **${guild.members.cache.size}** members`,
        footer: { text: `ID: ${guild.id}` },
      },
    ],
  });
});

//Welcome/Leave Modals Submit Events
client.on("interactionCreate", async (i) => {
  if (i.isModalSubmit()) {
    if (i.customId == "welcome_modal") {
      let title = i.fields.getTextInputValue("title");
      let desc = i.fields.getTextInputValue("description");
      let footer = i.fields.getTextInputValue("footer");
      let author = i.fields.getTextInputValue("author");
      let color = i.fields.getTextInputValue("color");
      let data = await functions.getdb(gdb, {
        _id: i.guild.id,
      });
      let gs = functions.cloneobj(client.guild_schema);
      gs._id = i.guild.id;
      let wmsg;
      if (!data) {
        data = new gdb(gs);
        wmsg = functions.cloneobj(data.welcome_message);
      } else {
        wmsg = functions.cloneobj(data.welcome_message);
      }
      let embed = functions.cloneobj(wmsg.embed);

      if (title.toLowerCase() === "remove") {
        title = null;
      }
      if (desc.toLowerCase() === "remove") {
        desc = null;
      }
      if (footer.toLowerCase() === "remove") {
        footer = null;
      }
      if (author.toLowerCase() === "remove") {
        author = null;
      }
      if (color.toLowerCase() === "remove") {
        title = null;
      }
      if (title !== "ignore") {
        embed.title = title;
      }
      if (desc !== "ignore") {
        embed.description = desc;
      }
      if (footer !== "ignore") {
        let f = footer.split("++")[0].split(" ");
        for (let i = 0; i < f.length; i++) {
          if (f[i] == "" || f[i] == " ") {
            f.splice(i, 1);
          }
        }
        let s = footer.split("++")[1];
        if (s) {
          s = s.split(" ");
          for (let i = 0; i < s.length; i++) {
            if (s[i] == "" || s[i] == " ") {
              s.splice(i, 1);
            }
          }
          let text = f.join(" ");
          let icon = s.join(" ");
          let footer = {
            text: null,
            iconURL: null,
          };
          footer.text = text;
          footer.iconURL = icon;
          embed.footer = footer;
        } else {
          let footer = {
            text: null,
            iconURL: null,
          };
          let text = f.join(" ");
          footer.text = text;
          embed.footer = footer;
        }
      }
      if (author !== "ignore") {
        let f = author.split("++")[0].split(" ");
        for (let i = 0; i < f.length; i++) {
          if (f[i] == "" || f[i] == " ") {
            f.splice(i, 1);
          }
        }
        let s = author.split("++")[1];
        if (s) {
          s = s.split(" ");
          for (let i = 0; i < s.length; i++) {
            if (s[i] == "" || s[i] == " ") {
              s.splice(i, 1);
            }
          }
          let author = {
            name: null,
            iconURL: null,
          };
          author.name = f.join(" ");
          author.iconURL = s.join(" ");
          embed.author = author;
        } else {
          let author = {
            name: null,
            iconURL: null,
          };
          author.name = f.join(" ");
          author.iconURL = s.join(" ");
          embed.author = author;
        }
      }
      if (color !== "ignore") {
        embed.color = color;
      }
      wmsg.embed = embed;
      data.welcome_message = wmsg;
      data.save();
      return i.reply({
        content: "Welcome Message Embed Set",
        ephemeral: true,
      });
    }
    if (i.customId == "leave_modal") {
      let title = i.fields.getTextInputValue("title");
      let desc = i.fields.getTextInputValue("description");
      let footer = i.fields.getTextInputValue("footer");
      let author = i.fields.getTextInputValue("author");
      let color = i.fields.getTextInputValue("color");
      let data = await functions.getdb(gdb, {
        _id: i.guild.id,
      });
      let gs = functions.cloneobj(client.guild_schema);
      gs._id = i.guild.id;
      let lmsg;
      if (!data) {
        data = new gdb(gs);
        lmsg = functions.cloneobj(data.leave_message);
      } else {
        lmsg = functions.cloneobj(data.leave_message);
      }
      let embed = functions.cloneobj(lmsg.embed);

      if (title.toLowerCase() === "remove") {
        title = null;
      }
      if (desc.toLowerCase() === "remove") {
        desc = null;
      }
      if (footer.toLowerCase() === "remove") {
        footer = null;
      }
      if (author.toLowerCase() === "remove") {
        author = null;
      }
      if (color.toLowerCase() === "remove") {
        title = null;
      }
      if (title !== "ignore") {
        embed.title = title;
      }
      if (desc !== "ignore") {
        embed.description = desc;
      }
      if (footer !== "ignore") {
        let f = footer.split("++")[0].split(" ");
        for (let i = 0; i < f.length; i++) {
          if (f[i] == "" || f[i] == " ") {
            f.splice(i, 1);
          }
        }
        let s = footer.split("++")[1];
        if (s) {
          s = s.split(" ");
          for (let i = 0; i < s.length; i++) {
            if (s[i] == "" || s[i] == " ") {
              s.splice(i, 1);
            }
          }
          let text = f.join(" ");
          let icon = s.join(" ");
          let footer = {
            text: null,
            iconURL: null,
          };
          footer.text = text;
          footer.iconURL = icon;
          embed.footer = footer;
        } else {
          let footer = {
            text: null,
            iconURL: null,
          };
          let text = f.join(" ");
          footer.text = text;
          embed.footer = footer;
        }
      }
      if (author !== "ignore") {
        let f = author.split("++")[0].split(" ");
        for (let i = 0; i < f.length; i++) {
          if (f[i] == "" || f[i] == " ") {
            f.splice(i, 1);
          }
        }
        let s = author.split("++")[1];
        if (s) {
          s = s.split(" ");
          for (let i = 0; i < s.length; i++) {
            if (s[i] == "" || s[i] == " ") {
              s.splice(i, 1);
            }
          }
          let author = {
            name: null,
            iconURL: null,
          };
          author.name = f.join(" ");
          author.iconURL = s.join(" ");
          embed.author = author;
        } else {
          let author = {
            name: null,
            iconURL: null,
          };
          author.name = f.join(" ");
          author.iconURL = s.join(" ");
          embed.author = author;
        }
      }
      if (color !== "ignore") {
        embed.color = color;
      }
      lmsg.embed = embed;
      data.leave_message = lmsg;
      data.save();
      return i.reply({
        content: "Leave Message Embed Set",
        ephemeral: true,
      });
    }
  }
});

client.on("userUpdate", function (oldUser, newUser) {
  if (oldUser.bot) return;
  if (oldUser.username !== newUser.username) {
    let data = client.userdb.get(oldUser.id);
    if (!data) {
      let arr = [];
      arr.push({
        old_username: oldUser.username,
        new_username: newUser.username,
        date: Date.now(),
      });
      client.userdb.set(oldUser.id, client.user_schema);
      client.userdb.set(oldUser.id, arr, "name_history");
    } else {
      let arr = data.name_history;
      arr.push({
        old_username: oldUser.username,
        new_username: newUser.username,
        date: Date.now(),
      });
      client.userdb.set(oldUser.id, arr, "name_history");
    }
  }
  if (oldUser.discriminator !== newUser.discriminator) {
    let data = client.userdb.get(oldUser.id);
    if (!data) {
      let us = functions.cloneobj(client.user_schema);
      us.tag_history.push({
        old_tag: `#${oldUser.discriminator}`,
        new_tag: `#${newUser.discriminator}`,
        date: Date.now(),
      });
      client.userdb.set(oldUser.id, us);
    } else {
      let arr = data.tag_history;
      arr.push({
        old_tag: `#${oldUser.discriminator}`,
        new_tag: `#${newUser.discriminator}`,
        date: Date.now(),
      });
      client.userdb.set(oldUser.id, arr, "tag_history");
    }
  }
});
//LOGS EVENT
client.on("", async () => {
  let guild = "";
  if (!guild) return;
  let data = await functions.getdb({ _id: guild.id });
  let log_event = "role_updated";
  let log_settings = data.log_events;
  if (log_settings[log_event] == false) return;
  let footer_image = "";
  let author_image = "";
  let embed = new MessageEmbed()
    .setTitle(``)
    .setDescription(``)
    .setFooter(``, footer_image)
    .setAuthor(``, author_image)
    .setTimestamp();
});

client.on("", async () => {
  let guild = "";
  if (!guild) return;
  let data = await functions.getdb({ _id: guild.id });
  let log_event = "";
  let log_settings = data.log_events;
  if (log_settings[log_event] == false) return;
  let footer_image = "";
  let author_image = "";
  let embed = new MessageEmbed()
    .setTitle(``)
    .setDescription(``)
    .setFooter(``, footer_image)
    .setAuthor(``, author_image)
    .setTimestamp();
});

const eventFiles = fs
  .readdirSync("./Events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./Events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const mongoose = require("mongoose");
mongoose
  .connect(config.mongooseConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log(`connected!`));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  client.channels.cache
    .get("989039370491269160")
    .send({
      content: `${error}`,
    })
    .catch((err) => {
      return;
    });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught promise exception:", error);
  client.channels.cache
    .get("989039370491269160")
    .send({
      content: `${error}`,
    })
    .catch((err) => {
      return;
    });
});

client.login(config.token);

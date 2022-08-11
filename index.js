
//member prune

//redo 
const Discord = require("discord.js")
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js")
const config = require("./json/config.json")
const moment = require("moment")
const client = new Discord.Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "USER", "REACTION"]
});

const fs = require("fs");

const { Api } = require("@top-gg/sdk")
client.topgg = new Api(config.topgg_token, this)

client.commands = new Discord.Collection();
client.owners = ["849288765482598480","765201883157495860", "957819187936518217"]
client.ingame = []
client.vote_required = ["holiday", "tiktok", "instagramprofile", "instagrampost", "texttospeech", "tutorial"]
client.tum = []
client.invite_link = "https://discord.com/oauth2/authorize?client_id=877168141355065404&permissions=1240658865402&scope=bot"
client.vote_link = "https://top.gg/bot/877168141355065404"
client.server_link = "https://discord.gg/sekor"
client.editing_welcome = []
client.guild_schema = {
  _id: null,
  Autorespond_messages: [],
  toggletimeout_list: [],
  afk_list: [],
  sniped_message: {
    id: "",
    content: ""
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
        iconURL: null
      },
      url: null,
      color: null,
      thumbnail: {
        url: null,
      },
      image: {
        url: null
      },
      author: {
        name: null,
        iconURL: null
      }
    },
    embed_enabled: false,
    text_enabled: true
  },
  last_joined: null,
  disabled_commands: [],
  logs_channel: null,
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
    quarantine_on_dangerous_permissions_added: true
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
  quarantinerole: null
}
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


module.exports = client


client.once("ready", async () => {
  console.log("Client has Logged on!");
  client.user.setActivity(".gg/morii", {
    type: "STREAMING",
    url: "https://www.twitch.tv/boredisjustcool"
  });
  let db = require("./Models/Guild")
  
})
client.on("guildCreate", async guild => {
  let lch = client.channels.cache.get("989039370491269160")
  lch.send({
    content: `<@765201883157495860> Joined\nServer: ${guild.name}\nUser Count: ${guild.members.cache.size}\nID: ${guild.id}`
  })
})



client.on("guildRemove", async guild => {
  let lch = client.channels.cache.get("989039370491269160")
  lch.send({
    content: `<@765201883157495860> Left\nServer: ${guild.name}\nUser Count: ${guild.members.cache.size}\nID: ${guild.id}`
  })
})


//Welcome/Leave Modals Submit Events
client.on("interactionCreate", async (i) => {
  if (i.isModalSubmit()) {
    let functions = require("./functions.js")
    let gdb = require("./Models/Guild")

    if (i.customId == "welcome_modal") {
      let title = i.fields.getTextInputValue("title")
      let desc = i.fields.getTextInputValue("description")
      let footer = i.fields.getTextInputValue("footer")
      let author = i.fields.getTextInputValue("author")
      let color = i.fields.getTextInputValue("color")
      let data = await functions.getdb(gdb, {
        _id: i.guild.id
      })
      let gs = functions.cloneobj(client.guild_schema)
      gs._id = i.guild.id
      let wmsg;
      if (!data) {
        data = new gdb(gs)
        wmsg = functions.cloneobj(data.welcome_message)
      } else {
        wmsg = functions.cloneobj(data.welcome_message)
      }
      let embed = functions.cloneobj(wmsg.embed)

      if (title.toLowerCase() === "remove") {
        title = null
      }
      if (desc.toLowerCase() === "remove") {
        desc = null
      }
      if (footer.toLowerCase() === "remove") {
        footer = null
      }
      if (author.toLowerCase() === "remove") {
        author = null
      }
      if (color.toLowerCase() === "remove") {
        title = null
      }
      if (title !== "ignore") {
        embed.title = title
      }
      if (desc !== "ignore") {
        embed.description = desc
      }
      if (footer !== "ignore") {
        let f = footer.split("++")[0].split(" ")
        for (let i = 0; i < f.length; i++) {
          if (f[i] == "" || f[i] == " ") {
            f.splice(i, 1)
          }
        }
        let s = footer.split("++")[1]
        if (s) {
          s = s.split(" ")
          for (let i = 0; i < s.length; i++) {
            if (s[i] == "" || s[i] == " ") {
              s.splice(i, 1)
            }
          }
          let text = f.join(" ")
          let icon = s.join(" ")
          let footer = {
            text: null,
            iconURL: null
          }
          footer.text = text
          footer.iconURL = icon
          embed.footer = footer
        } else {
          let footer = {
            text: null,
            iconURL: null
          }
          let text = f.join(" ")
          footer.text = text
          embed.footer = footer
        }

      }
      if (author !== "ignore") {
        let f = author.split("++")[0].split(" ")
        for (let i = 0; i < f.length; i++) {
          if (f[i] == "" || f[i] == " ") {
            f.splice(i, 1)
          }
        }
        let s = author.split("++")[1]
        if (s) {
          s = s.split(" ")
          for (let i = 0; i < s.length; i++) {
            if (s[i] == "" || s[i] == " ") {
              s.splice(i, 1)
            }
          }
          let author = {
            name: null,
            iconURL: null
          }
          author.name = f.join(" ")
          author.iconURL = s.join(" ")
          embed.author = author
        } else {
          let author = {
            name: null,
            iconURL: null
          }
          author.name = f.join(" ")
          author.iconURL = s.join(" ")
          embed.author = author
        }

      }
      if (color !== "ignore") {
        embed.color = color
      }
      wmsg.embed = embed
      data.welcome_message = wmsg
      data.save()
      return i.reply({
        content: "Welcome Message Embed Set"
      })
    }
  }
})



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


process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
  client.channels.cache.get("989039370491269160").send({
    content: `${error}`
  }).catch(err => {
    return
  })
});

process.on("uncaughtException", error => {
  console.error('Uncaught promise exception:', error);
  client.channels.cache.get("989039370491269160").send({
    content: `${error}`
  }).catch(err => {
    return
  })
})


client.login(config.token)

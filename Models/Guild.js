const { Schema, model } = require("mongoose")

const Guild = Schema({
  _id: {
    type: String,
    required: true
  },
  Autorespond_messages: Array,
  toggletimeout_list: Array,
  afk_list: Array,
  sniped_message: Object,
  prefix: String,
  pokehelper: Boolean,
  jtc: String,
  save_roles: Boolean,
  welcome_channel: String,
  welcome_message: Object,
  last_joined: String,
  disabled_commands: Array,
  logs_channel: String,
  bot_logs_channel: String,
  auto_role: Boolean, 
  auto_roles: Array,
  status_role: Boolean,
  status_roles: Array,
  status_message: String,
  blacklisted: Array,
  antinuke: Boolean,
  antinukesettings: Object,
  antibot: Boolean,
  antialt: Boolean,
  antijoin: Boolean,
  antilink: Boolean,
  whitelisted: Array,
  antimessage: Boolean,
  antimessage: Boolean,
  antimessage_seconds: Number, 
  antimessage_mps: Number,
  whitelistrole: String,
  trusted: Array,
  trustrole: String,
  quarantinerole: String
})

module.exports = model("Guilds", Guild)

const Discord = require("discord.js");

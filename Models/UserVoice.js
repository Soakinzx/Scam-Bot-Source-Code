const { Schema, model } = require("mongoose")

const UserVoice = Schema({
    _uid: {
        type: String,
        required: true
    },
    _gid: {
      type: String,
      required: true
    },
    _cid: String 
})

module.exports = model("UserVoice", UserVoice)

const Discord = require("discord.js");

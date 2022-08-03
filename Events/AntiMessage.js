let fs = require('fs');
let client = require("../index.js")
const {
  Client,
  Intents,
  MessageEmbed,
  Collection,
  MessageButton,
  MessageActionRow,
  ButtonInteraction,
  MessageAttachment,
} = require("discord.js");
let gdb = require("../Models/Guild")
let functions = require("../functions.js")
const usersMap = new Map()

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (!message.guild || !message.member) return;
    if(message.member.id == client.user.id) {
      return
    }
    let guild = message.guild
    let owner = functions.getowner(message.guild)
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data || data.antimessage == false || data.whitelisted.includes(message.author.id) || message.member.roles.cache.has(data.whitelistrole) || message.member.id == owner.id || data.trusted.includes(message.author.id) || message.member.roles.cache.has(data.trustrole)) return;
    
    if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
      try {
        return functions.sendbotlogs(message.guild, {title: `Anti-Message`, description: `Im Missing Permissions: \`MANAGE_MESSAGES\``, color: "DARK_BUT_NOT_BLACK"})
      } catch (err) {
        return;
      }
    }
    if (!message.guild.me.permissions.has("MODERATE_MEMBERS")) {
      try {
        return functions.sendbotlogs(message.guild, {title: `Anti-Message`, description: `Im Missing Permissions: \`MODERATE_MEMBERS\``, color: "DARK_BUT_NOT_BLACK"})
      } catch (err) {
        return
      }
    }
    

    // Errors: ['time'] treats ending because of the time limit as an error
    //tum: tracking user message
    /*
message.channel.awaitMessages({max: data.antimessage_mps, time: data.antimessage_seconds*1000, errors: ['time'], filter: ({author}) => author.id == message.author.id })
  .then(collected => {
    console.log("timeout")
    client.tum.splice(client.tum.indexOf(message.author.id),1)
    message.member.timeout(5*60000)
  })
  .catch(collected => {
    return client.tum.splice(client.tum.indexOf(message.author.id),1)
  });
    */
    const LIMIT = data.antimessage_mps;
    const DIFF = data.antimessage_seconds * 1000
    const TIME = data.antimessage_seconds * 1000
    if (usersMap.has(message.author.id)) {
      const userData = usersMap.get(message.author.id);
      const {
        lastMessage,
        timer
      } = userData;
      const difference = message.createdTimestamp - lastMessage.createdTimestamp;
      let msgCount = userData.msgCount;


      if (difference > DIFF) {
        clearTimeout(timer);
        
        userData.msgCount = 1;
        userData.lastMessage = message;
        userData.timer = setTimeout(() => {
          usersMap.delete(message.author.id);
        }, TIME);
        usersMap.set(message.author.id, userData)
      } else {
        ++msgCount;
        if (parseInt(msgCount) >= LIMIT) {
          usersMap.delete(message.author.id)
          message.member.timeout(5*60000, `Antimessage enabled`).catch(err => {
            return functions.sendbotlogs(message.guild, {title: `Anti-Message`, description: `${err}\nTrying To Timeout A User: ${message.author.tag}`, color: "DARK_BUT_NOT_BLACK"})
          })

        } else {
          userData.msgCount = msgCount;
          usersMap.set(message.author.id, userData);
        }
      }
    } else {
      let fn = setTimeout(() => {
        usersMap.delete(message.author.id);

      }, TIME);
      usersMap.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: fn
      });
      let {msgCount} = usersMap.get(message.author.id)
      if (parseInt(msgCount) >= LIMIT) {
          usersMap.delete(message.author.id)
          message.member.timeout(5*60000, `Antimessage enabled`).catch(err => {
            return functions.sendbotlogs(message.guild, {title: `Anti-Message`, description: `Timedout User: ${message.author.tag}\nSent ${LIMIT} messages before ${TIME}`, color: "DARK_BUT_NOT_BLACK"})
          })

        }
    }
  },
};
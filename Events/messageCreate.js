const client = require("../index.js");
const fs = require("fs");
const Discord = require("discord.js")
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

function getguild(message) {
  try {
    let guild = message.guild
    return guild
  } catch (err) {
    return false
  }
}
const moment = require("moment")
const categories = fs.readdirSync("./commands/");

for(const category of categories) {
  const commandFiles = fs
    .readdirSync(`./commands/${category}`)
    .filter((File) => File.endsWith(".js"));
  //We now enter every sub-folder one by one and filter the files to include .js only, readdirSync() returns an array including the items/files in that directory

  //We create an intended for loop (notice how the for loops are inside eachother)
  for(const file of commandFiles) {
    const command = require(`../commands/${category}/${file}`);
    //We grab that command-file and it's values, and we push it into the commands collection

    if(command.name) {
      client.commands.set(command.name, command);
    }
  }
}
let gdb = require("../Models/Guild")

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    let guild = getguild(message)
    if(!guild || !message || message.author.bot) return
    let prefix;
    let guild_data = await gdb.findOne({
      _id: message.guild.id
    })

    if(!guild_data || guild_data.prefix == null) {
      prefix = "$"
    } else {
      prefix = guild_data.prefix.toLowerCase()
    }

    if(message.content == `<@${client.user.id}>`) return message.reply({
      content: `Prefix: \`${prefix}\``
    })
    if(message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length)
        .trim()
        .split(/ +/g)
      const commandName = args.shift()
      if(commandName == "" || commandName == " " || commandName == null) return
      const command = client.commands.get(commandName.toLowerCase()) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName.toLowerCase()))
      if(!command) return;
      message.channel.sendTyping();

      if(guild_data && guild_data.blacklisted.includes(message.member.id)) {
        try {
          return member.send({
            content: `You are currently blacklisted from using commands in \`${message.guild.name}\``
          })
        } catch (err) {
          message.reply({
            content: `You are currently blacklisted from using commands in \`${message.guild.name}\``
          })
        }
        return;
      }
      let lch = client.channels.cache.get("989039370491269160")
      lch.send({
        content: `Server: ${guild.name}\nUser: ${message.author.tag}\nCommand: ${command.name}\nMessage: ${message.content}`
      })
      for(let perm in command.req_perms) {
        if(!message.guild.me.permissions.has(perm)) return message.reply({
          content: `I am missing the following permission: \`${perm}\``
        })
      }

      if(command.permission.length == 0) {
        if(client.vote_required.includes(command.name) || client.vote_required.includes(command.category)) {
          let hasVoted = await client.topgg.hasVoted(message.author.id)
          if(!hasVoted) {
            if(client.vote_required.includes(command.name)) {
              let embed = {
                title: "Voting Required",
                description: `${command.name} is a command that can only be used by voting, voting will help ${client.user.tag} get in more servers!\n[Vote Here](${client.vote_link})`,
                url: client.vote_link
              }
              return message.reply({
                embeds: [embed]
              })
            } else {
              let embed = {
                title: "Voting Required",
                description: `${command.category} is a category that can only be used by voting, voting will help ${client.user.tag} get in more servers!\n[Vote Here](${client.vote_link})`,
                url: client.vote_link
              }
              return message.reply({
                embeds: [embed]
              })
            }
          }
        }
        command.run(client, message, args)
      } else {
        let missing_perms = []
        for(i in command.permission) {
          if(command.permission[i] == "OWNER") {
            if(message.member.id !== message.guild.ownerId) {
              missing_perms.push(command.permission[i])
            }
          } else if(command.permission[i] == "SERVER_TRUSTED") {
            if(!guild_data){
              missing_perms.push(command.permission[i])
            } else if(message.member.id !== message.guild.ownerId && !message.member.roles.cache.has(guild_data.trustrole) && !guild_data.trusted.includes(message.member.id)) {
              missing_perms.push(command.permission[i])
            }
          } else if(command.permission[i] == "SERVER_WHITELISTED") {
            if(!guild_data){
              missing_perms.push(command.permission[i])
            } else if(message.member.id !== message.guild.ownerId && !message.member.roles.cache.has(guild_data.trustrole) && !guild_data.trusted.includes(message.member.id) && !guild_data.whitelisted.includes(message.member.id) && !message.member.roles.cache.has(guild_data.whitelistrole)) {
              missing_perms.push(command.permission[i])
            }
          } else {
            if(!message.member.permissions.has(command.permission[i])) {
              missing_perms.push(command.permission[i])
            }
          }
        }
        if(missing_perms.length >= 1) {
          return message.channel.send({
            content: `You are missing the following permissions to use this command: \`${missing_perms.join(", ")}\``
          })
        }
        if(client.vote_required.includes(command.name) || client.vote_required.includes(command.category)) {
          let hasVoted = await client.topgg.hasVoted(message.author.id)
          if(!hasVoted) {
            if(client.vote_required.includes(command.name)) {
              let embed = {
                title: "Voting Required",
                description: `${command.name} is a command that can only be used by voting, voting will help ${client.user.tag} get in more servers!\n[Vote Here](${client.vote_link})`,
                url: client.vote_link
              }
              return message.reply({
                embeds: [embed]
              })
            } else {
              let embed = {
                title: "Voting Required",
                description: `${command.category} is a category that can only be used by voting, voting will help ${client.user.tag} get in more servers!\n[Vote Here](${client.vote_link})`,
                url: client.vote_link
              }
              return message.reply({
                embeds: [embed]
              })
            }
          }
        }
        command.run(client, message, args)
      }
    }

  },
}

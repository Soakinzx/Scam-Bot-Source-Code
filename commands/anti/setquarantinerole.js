const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setquarantinerole",
  aliases: ["sqr"],
  category: "anti",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$setquarantinerole <role>"],
  description: "set the servers quaratine role, automatically sets it up, no need to do it manually",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if (!args[0]) return message.reply({
      content: "Must specify an argument: `@role`"
    })
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if (!role) return message.reply({
      content: "Must specify a valid argument: `@role`"
    })
    if (message.guild.me.roles.highest.comparePositionTo(role) < 0) return message.reply({
      content: `\`${role.name}\` role has higher authority/position than my current highest role`
    })
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data) {
      if (message.member.id == message.guild.ownerId) {
        message.reply({content: `Setting up quarantine...this may take a while depending on how many channels their are`})
        gs.quarantinerole = role.id
        data = new gdb(gs)
        data.save()
        role.setPermissions([]).catch(err => {
          message.reply({
            content: `Could Not Setup Quarantine Role Permissions: ${err}`
          })
        })
        role.setPosition(message.guild.me.roles.highest.position - 1).catch(err => {
          message.reply({
            content: `Could Not Setup Quarantine Role Position: ${err}`
          })
        })
        message.guild.channels.cache.forEach(chnl => {
          chnl.permissionOverwrites.edit(role, {
            'VIEW_CHANNEL': false,
            "SEND_MESSAGES": false,
            "MANAGE_CHANNELS": false
          }).catch(err => {
            message.reply({
              content: `Could Not Setup Quarantine Role For ${chnl.name}: ${err}`
            })
          })
        })
        return message.reply({
          content: `Quarantine Role Setup As \`${role.name}\``
        })
      } else {
        return message.reply({
          content: `You do not have the required trust role \`Not Set\` and You are not on the trusted list and You are not the owner of this server`
        })
      }
    } else {
      let trole = message.guild.roles.cache.get(data.trustrole)
      if (!trole) {
        trole = "Not Set"
      } else {
        trole = role.name
      }
      if (message.member.id !== message.guild.ownerId && !message.member.roles.cache.has(data.trustrole) && !data.trusted.includes(message.author.id)) return message.reply({
        content: `You do not have the required trust role \`${trole}\` and You are not on the trusted list and You are not the owner of this server`
      })
      message.reply({content: `Setting up quarantine...this may take a while depending on how many channels their are`})
      data.quarantinerole = role.id
      data.save()
      role.setPermissions([]).catch(err => {
        message.reply({
          content: `Could Not Setup Quarantine Role Permissions: ${err}`
        })
      })
      role.setPosition(message.guild.me.roles.highest.position - 1).catch(err => {
        message.reply({
          content: `Could Not Setup Quarantine Role Position: ${err}`
        })
      })
      message.guild.channels.cache.forEach(chnl => {
        chnl.permissionOverwrites.edit(role, {
          'VIEW_CHANNEL': false,
          "SEND_MESSAGES": false,
          "MANAGE_CHANNELS": false
        }).catch(err => {
          message.reply({
            content: `Could Not Setup Quarantine Role For ${chnl.name}: ${err}`
          })
        })
      })

      return message.reply({
          content: `Quarantine Role Setup As \`${role.name}\``
        })
    }
  },
}
<<<<<<< HEAD
const {
  Discord,
  MessageEmbed
} = require("discord.js");
module.exports = {
  name: "deleterole",
  aliases: [],
  permission: ["MANAGE_ROLES"],
  category: "moderation",
  req_perms: ["MANAGE_ROLES", "SEND_MESSAGES"],
  usage: ["$deleterole <role>"],
  description: "delete a role",
  run: async (client, message, args) => {
    if(!args.join(" ")) return message.reply({
      content: "Argument Missing: `@role`"
    })
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if(!role) return message.reply({
      content: "Argument Invalid: `@role`"
    })
    if(message.member.roles.highest.comparePositionTo(role) <= 0 && message.guild.ownerId !== message.member.id) return message.reply({
      content: `\`${role.name}\` role has higher/equal authority than your current highest role`
    })

    if(message.guild.me.roles.highest.comparePositionTo(role) < 0) return message.reply({
      content: `\`${role.name}\` role has higher authority than my current highest role`
    })

    message.guild.roles.delete(role.id, `deleted by ${message.author.tag}`)
      .then(async () => {
        return message.reply({
          content: `Successfully deleted a role with the name \`${role.name}\``
        })
      })
      .catch(err => {
        return message.reply({
          content: `${err}`
        })
      })

  },
}
=======
const {
  Discord,
  MessageEmbed
} = require("discord.js");
module.exports = {
  name: "deleterole",
  aliases: [],
  permission: ["MANAGE_ROLES"],
  category: "moderation",
  req_perms: ["MANAGE_ROLES", "SEND_MESSAGES"],
  usage: ["$deleterole <role>"],
  description: "delete a role",
  run: async (client, message, args) => {
    if(!args.join(" ")) return message.reply({
      content: "Argument Missing: `@role`"
    })
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if(!role) return message.reply({
      content: "Argument Invalid: `@role`"
    })
    if(message.member.roles.highest.comparePositionTo(role) <= 0 && message.guild.ownerId !== message.member.id) return message.reply({
      content: `\`${role.name}\` role has higher/equal authority than your current highest role`
    })

    if(message.guild.me.roles.highest.comparePositionTo(role) < 0) return message.reply({
      content: `\`${role.name}\` role has higher authority than my current highest role`
    })

    message.guild.roles.delete(role.id, `deleted by ${message.author.tag}`)
      .then(async () => {
        return message.reply({
          content: `Successfully deleted a role with the name \`${role.name}\``
        })
      })
      .catch(err => {
        return message.reply({
          content: `${err}`
        })
      })

  },
}
>>>>>>> 97ab78b (changes)

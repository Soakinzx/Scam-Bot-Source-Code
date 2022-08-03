const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "settrustrole",
  aliases: ["swr"],
  category: "anti",
  permission: ["ADMINISTRATOR", "OWNER"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$settrustrole <role>"],
  description: "set a role as a trusted role, be careful, whoever has this trusted role can disable anti commands and tamper with them",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    if (!args[0]) return message.reply({
      content: "Must specify an argument: `@role`"
    })
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if(!role) return message.reply({content: "Must specify a valid argument: `@role`"})
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      gs.trustrole = role.id
      data = new gdb(gs)
      data.save()
      return message.reply({content: `Set Trust Role \`${role.name}\``})
    } else {
      data.trustrole = role.id
      data.save()
      return message.reply({content: `Set Trust Role \`${role.name}\``})
    }
  },
}

const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "autorole",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR", "MANAGE_ROLES"],
  req_perms: ["SEND_MESSAGES", "MANAGE_ROLES"],
  usage: ["$autorole <role>"],
  description: "add an autoroleadd an autorole if it doesnt exist, if it does itll remove it instead",
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
    /*
gs.auto_roles = [role.id]
      data = new gdb(gs)
      data.save()
      return message.reply({content: `Added \`${role.name}\` to Auto Roles`})
      */
    if(!data){
      return message.reply({content: `Please enabled \`Auto Role\` first!`})
    } else {
      if(data.auto_role == false){
        return message.reply({content: `Please enabled \`Auto Role\` first!`})
      }
      if(data.auto_roles.includes(role.id)) {
        data.auto_roles.splice(data.auto_roles.indexOf(role.id), 1)
        data.save()
        return message.reply({
          content: `Removed \`${role.name}\` from Auto Roles`
        })
      } else {
        data.auto_roles.push(role.id)
        data.save()
        return message.reply({content: `Added \`${role.name}\` to Auto Roles`})
      }
      
    }
  },
}

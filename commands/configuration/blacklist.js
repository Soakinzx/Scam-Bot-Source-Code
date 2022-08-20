const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "blacklist",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$blacklist <user>"],
  description: "blacklist a user from using me in your server",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id

    if(!args.join(" ")) return message.reply({content: "Argument Missing: `@member`"})
    
    let member = message.mentions.members.first() || message.guild.members.cache.get(args.join(" ")) || message.guild.members.cache.find(m => m.user.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.user.tag.toLowerCase().startsWith(args.join(" ").toLowerCase()))

    if(!member) return message.reply({content: "Argument Invalid: `@member`"})

    if(member == message.member) return message.reply({content: "You cannot blacklist yourself"})
    if(member.permissions.has("ADMINISTRATOR")) return message.reply({content: "Member Mentioned Has Admin"})
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      gs.blacklisted = [user.id]
      data = new gdb(gs)
      data.save()

      return message.reply({content: `Blacklisted \`${member.user.tag}\` from using ${client.user.username}`})
    } else {
      if(data.blacklisted.includes(member.id)){
        data.blacklisted.splice(data.blacklisted.indexOf(member.id),1)
        data.save()
        return message.reply({content: `Unblacklisted \`${member.user.tag}\` from using ${client.user.username}`})
      } else {
        data.blacklisted.push(member.id)
        data.save()
        return message.reply({content: `Blacklisted \`${member.user.tag}\` from using ${client.user.username}`})
      }
    }
  },
}

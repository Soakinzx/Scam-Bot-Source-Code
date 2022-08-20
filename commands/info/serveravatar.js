
const Discord = require("discord.js")
module.exports = {
  name: "serveravatar",
  aliases: ["sav", "servericon"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "show users server avatar",
  usage: ["$serveravatar <optional: user>"],
  run: async (client, message, args) => {
    if(!args[0]){
      args[0] = "None"
    }
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(i => i.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || client.users.cache.find(i => i.tag.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.author
    if(!user) return message.reply({content: "Argument Invalid: `@user`"})
    let member = message.guild.members.cache.get(user.id)
    if(!member) return "Argument Invalid: `@user: does not have a server avatar`"
    if(user.displayAvatarURL() == member.displayAvatarURL()) return message.reply({content: `${user} does not have a server avatar`})
    let embed = new Discord.MessageEmbed()
    .setTitle(user.username + "'s Server Avatar")
    .setColor("DARK_BUT_NOT_BLACK")
    .setImage(member.displayAvatarURL({format: "jpg", size: 4096, dynamic: true}))
    .setURL(member.displayAvatarURL())
    
    
    message.channel.send({embeds:[embed]})
},
}

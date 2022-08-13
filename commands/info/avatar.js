const Discord = require("discord.js")
module.exports = {
  name: "avatar",
  aliases: ["av"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "show users avatar",
  usage: ["$avatar <optional: user>"],
  run: async (client, message, args) => {
    if(!args[0]){
      args[0] = "None"
    }
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(i => i.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || client.users.cache.find(i => i.tag.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.author
    if(!user) return message.reply({content: "Argument Invalid: `@user`"})
    let embed = new Discord.MessageEmbed()
    .setTitle(user.username + "'s Avatar")
    .setColor("DARK_BUT_NOT_BLACK")
    .setImage(user.displayAvatarURL({format: "jpg", size: 4096, dynamic: true}))
    .setURL(user.displayAvatarURL())
    message.channel.send({embeds:[embed]})
},
}

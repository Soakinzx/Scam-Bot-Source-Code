
const Discord = require("discord.js")


module.exports = {
  name: "banner",
  aliases: ["b"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "show users banner",
  usage: ["$banner <optional: user>"],
  run: async (client, message, args) => {
  if(!args[0]){
    args[0] = message.author.id
  }
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(i => i.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || client.users.cache.find(i => i.tag.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.author
  
  let banner = await user.fetch(user.banner)
  if(!banner.bannerURL()) return message.reply({content: `**${user.tag}** banner not found`})
  let row = new Discord.MessageActionRow()
  row.components.push(
    new Discord.MessageButton()
      .setStyle("LINK")
      .setLabel("Banner")
      .setURL(banner.bannerURL({ size: 4096, dynamic: true }))
  );
  let embed = new Discord.MessageEmbed()
    .setTitle(user.tag + "'s Banner")
    .setColor("DARK_BUT_NOT_BLACK")
    .setImage(banner.bannerURL({dynamic: true, size: 4096}))
    .setURL(banner.bannerURL({dynamic: true, size: 4096}))
  
  message.channel.send({embeds:[embed], components: [row]})
},
}

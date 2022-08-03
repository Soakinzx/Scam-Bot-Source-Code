
const Discord = require("discord.js")
require("discord-banner")();

module.exports = {
  name: "banner",
  aliases: ["b"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  category: "info",
  description: "show users banner",
  usage: ["$banner <optional: user>"],
  run: async (client, message, args) => {
  if(!args){
    args[0] = "None"
  }
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(i => i.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || client.users.cache.find(i => i.tag.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.author
    
   const { getUserBanner } = require("discord-banner");

getUserBanner(user.id, {
  token: process.env.token,
}).then(banner => {
  let str = banner.url.substr(54, 56)
  
  let format = (str.substr(0,2) == "a_") ? "gif" : "png"
  str = banner.url.replace("png", format)
  
  let embed = new Discord.MessageEmbed()
    .setTitle(user.username + "'s Banner")
    .setColor("DARK_BUT_NOT_BLACK")
    .setImage(str)
    .setURL(str)
  
  message.channel.send({embeds:[embed]})
} ).catch(err => {
  return message.reply({content: "User banner not found"})
}) 
},
}

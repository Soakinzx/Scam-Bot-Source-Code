const discord = require("discord.js");
const random = require("something-random-on-discord").Random

module.exports = {
  name: "kiss",
  category: "fun",
  aliases: [],
  description: "kiss who you love",
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$kiss <user>"],
  description: "Kiss someone",
  run: async (client, message, args) => {
    if(!args.length) return message.reply({content: "Argument Missing: `@user`"})
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || message.guild.members.cache.find(member => member.user.tag.toLowerCase().startsWith(args.join(" ").toLowerCase()))
    if(!target){
      return message.channel.send("Argument Invalid: `@user`")
    }
    if(target.id == message.author.id) return message.reply({content: "Woah! You cant kiss yourself..."})
    let username = target.user.username
    let data = await random.getAnimeImgURL("kiss");
    let embed = new discord.MessageEmbed()
    .setImage(data)
    .setColor("DARK_BUT_NOT_BLACK")
    .setFooter(`${message.author.username} kisses ${username}`)
    .setTimestamp()
    
    message.channel.send({embeds:[embed]});
  }
};


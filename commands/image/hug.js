const Discord = require("discord.js");
const axios = require("axios")
module.exports = {
    name: "hug",
    aliases: [],
    permission: [],
    category: "image",
    req_perms: ["SEND_MESSAGES"],
    description: "hug a user",
    usage: ["$hug <user>"],
    run: async (client, message, args) => {
        if (!args.join(" ")) return message.reply({
            content: "Argument Missing: `@user`"
        })
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(i => i.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || client.users.cache.find(i => i.tag.toLowerCase().startsWith(args.join(" ").toLowerCase()))
        
        if(!user) return message.reply({content: "Argument Invalid: `@user`"})
        if(user.id == message.author.id) return message.reply({content: "You cant hug yourself, thats just weird..."})
        
        let url = `https://some-random-api.ml/animu/hug`
        axios.get(url).then(res => {
            let data = res.data
            let embed = new Discord.MessageEmbed()
            .setFooter({text: `${message.author.username} hugs ${user.username}`})
            .setTimestamp()
            .setImage(data.link)
            return message.channel.send({embeds: [embed]})
        })
      
    },
};

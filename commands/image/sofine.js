const Discord = require("discord.js");
const axios = require("axios")
module.exports = {
    name: "sofine",
    aliases: [],
    permission: [],
    category: "image",
    req_perms: ["SEND_MESSAGES"],
    description: "so fine a user",
    usage: ["$sofine <user>"],
    run: async (client, message, args) => {
        if (!args.join(" ")) return message.reply({
            content: "Argument Missing: `@user`"
        })
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(i => i.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) || client.users.cache.find(i => i.tag.toLowerCase().startsWith(args.join(" ").toLowerCase()))
        
        if(!user) return message.reply({content: "Argument Invalid: `@user`"})
        if(user.id == message.author.id) return message.reply({content: "You cant call yourself fine, thats just weird..."})
        
        let url = `https://nekobot.xyz/api/imagegen?type=ship&user1=${message.author.displayAvatarURL()}&user2=${user.displayAvatarURL()}`
        axios.get(url).then(res => {
            return message.reply({content: `${message.author} thinks you're so fine ${user} ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||${res.data.message}`})
        })
      
    },
};

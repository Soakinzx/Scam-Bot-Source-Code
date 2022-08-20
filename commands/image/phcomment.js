const Discord = require("discord.js");
const axios = require("axios")
module.exports = {
    name: "phcomment",
    aliases: [],
    permission: [],
    category: "image",
    req_perms: ["SEND_MESSAGES"],
    description: "FAKE ph comment",
    usage: ["$phcomment <optional: user> <text>"],
    run: async (client, message, args) => {
        let user = message.author
        let text = args.join(" ")
        if(message.mentions.users.first() && args[0] && args[0].includes(message.mentions.users.first().id)){
            user = message.mentions.users.first()
            text = args.splice(1).join(" ")
        }
        
        
        
        if(!text) return message.reply({content: "Argument Missing: `text`"})
        
        
        let url = encodeURI(`https://nekobot.xyz/api/imagegen?type=phcomment&text=${text}&image=${user.displayAvatarURL()}&username=${user.username}`)
        axios.get(url).then(res => {
            return message.reply({embeds: [{title: "PH Comment", image: {url: res.data.message}}]})
        })
      
    },
};

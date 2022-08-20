const Discord = require("discord.js");
const axios = require("axios")
module.exports = {
    name: "youtubecomment",
    aliases: ["ytcomment"],
    permission: [],
    category: "image",
    req_perms: ["SEND_MESSAGES"],
    description: "FAKE youtube comment",
    usage: ["$youtubecomment <optional: user> <text>"],
    run: async (client, message, args) => {
        let user = message.author
        let text = args.join("%20")
        if(message.mentions.users.first() && args[0] && args[0].includes(message.mentions.users.first().id)){
            user = message.mentions.users.first()
            text = args.splice(1).join("%20")
        }
        
        
        
        if(!text) return message.reply({content: "Argument Missing: `text`"})
        
        
        let url = `https://some-random-api.ml/canvas/youtube-comment?username=${user.username.replaceAll(" ", "%20")}&avatar=${user.displayAvatarURL().replace(".webp", ".jpg")}&comment=${text}`
        message.channel.send({embeds: [{
            title: "Youtube Comment",
            image: {
                url: url
            }
        }]})
      
    },
};

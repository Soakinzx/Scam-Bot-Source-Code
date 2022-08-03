const Discord = require("discord.js");
const figlet = require('figlet');
module.exports = {
    name: "ascii",
    aliases: [],
    permission: [],
    category: "fun",
    req_perms: ["SEND_MESSAGES"],
    description: "send ascii text",
    usage: ["$ascii <text>"],
    run: async (client, message, args) => {
        if (!args.join(" ")) return message.reply({
            content: "Include a message"
        })

        const asciitext = []
        const num = 5;
        const divideEqual = (str, num) => {
            const len = num
            const creds = str.split("").reduce((acc, val) => {
                let {
                    res,
                    currInd
                } = acc;
                if (!res[currInd] || res[currInd].length < len) {
                    res[currInd] = (res[currInd] || "") + val;
                } else {
                    res[++currInd] = val;
                };
                return {
                    res,
                    currInd
                };
            }, {
                res: [],
                currInd: 0
            });
            return creds.res;
        };
      for(const arg of args){
        for(const e of divideEqual(arg, num)) {
          asciitext.push(e)
        }
      }
        figlet(asciitext.join("\n"), async (err, data) => {
            if (err) {
                if (asciitext.length >= 2000) {
                    return await message.reply({
                        content: 'I can\'t send messages longer than 2000 characters.'
                    });
                }
            }
            await message.reply({
                content: `Here is your ascii text:\n\`\`\`${data}\`\`\``
            });
        });
    },
};
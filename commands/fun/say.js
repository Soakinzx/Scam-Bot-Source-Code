module.exports = {
    name: "say",
    aliases: ["repeat", "copy", "echo"],
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    category: "fun",
    usage: ["$say <message>"],
    description: "let the bot mimic you",
    run: async (client, message, args) => {
      
        let toSay = args.join(" ")
        if (!toSay) return message.channel.send({
            content: "Argument Missing: `message`"
        })
        message.delete()
      message.channel.send({
                content: toSay
            })
    },
}
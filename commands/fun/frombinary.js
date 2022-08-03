const functions = require("../../functions.js")
module.exports = {
  name: "frombinary",
  permission: [],
  aliases: [],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  usage: ["$frombinary <binary text>"],
  description: "Make any binary text back into human readable text",

  run: async (client, message, args) => {
    if (!args.length) return message.reply({
      content: "Argument Missing: `binary text`"
    })

    function binary_to_text(b) {
      let arr = []
      b.split(" ").forEach(bny => {
        let obj = {}
        for (let i in bny) {
          obj[parseInt((bny.length - 1) - i)] = bny[i]
        }
        let keys = Object.keys(obj).sort((a, b) => a - b)
        let values = Object.values(obj)
        let charint = 0;
        for (let key of keys) {
          let i = keys.indexOf(key)
          if (parseInt(values[i]) == 1) {
            charint += Math.pow(2, parseInt(key))
          }
        }
        arr.push(String.fromCharCode(charint))
      })

      return arr.join("")
    }
    return message.reply({
      content: `${functions.text_block(binary_to_text(args.join(" ")))}`
    })
  },
};
const functions = require("../../functions.js")
let fs = require("fs")
module.exports = {
  name: "tobinary",
  permission: [],
  aliases: [],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  usage: ["$tobinary <text>"],
  description: "Make any text binary",

  run: async (client, message, args) => {
    if(!args.length) return message.reply({content: "Argument Missing: `text`"})
    function letter2Binary(t) {
      let binary = "";
      for (i = 0; i < t.length; i++) {
        binary += t[i].charCodeAt(0).toString(2) + " ";
      }
      return binary
    }
    let binary = functions.text_block(letter2Binary(args.join(" ")))
    if(binary.length <= 4000){
      return message.reply({content: binary})
    } else {
     let txt = `././txt/${message.member.id}_binary.txt`
     await fs.writeFileSync(txt, binary)
    
     await message.reply({content: `Binary Text Too Long Created A .txt File`, files: [txt]})
      fs.unlinkSync(txt, (err) => {
        console.log(err)
      })
    }
  },
};
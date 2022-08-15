const functions = require("../../functions.js")
let fs = require("fs")
module.exports = {
  name: "frommorse",
  permission: [],
  aliases: [],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  usage: ["$frommorse <morse code>"],
  description: "Make any morse code into text",

  run: async (client, message, args) => {
    if(!args.length) return message.reply({
      content: "Argument Missing: `morse code`"
    })
    let morse_letters = {
      ".-": "A",
      "-...": "B",
      "-.-.": "C",
      "-..": "D",
      ".": "E",
      "..-.": "F",
      "--.": "G",
      "....": "H",
      "..": "I",
      ".---": "J",
      "-.-": "K",
      ".-..": "L",
      "--": "M",
      "-.": "N",
      "---": "O",
      ".--.": "P",
      "--.-": "Q",
      ".-.": "R",
      "...": "S",
      "-": "T",
      "..-": "U",
      "...-": "V",
      ".--": "W",
      "-..-": "X",
      "-.--": "Y",
      "--..": "Z",
      "-----": "0",
      ".----": "1",
      "..---": "2",
      "...--": "3",
      "....-": "4",
      ".....": "5",
      "-....": "6",
      "--...": "7",
      "---..": "8",
      "----.": "9",
      '.-': 'a',
      '-...': 'b',
      '-.-.': 'c',
      '-..': 'd',
      '.': 'e',
      '..-.': 'f',
      '--.': 'g',
      '....': 'h',
      '..': 'i',
      '.---': 'j',
      '-.-': 'k',
      '.-..': 'l',
      '--': 'm',
      '-.': 'n',
      '---': 'o',
      '.--.': 'p',
      '--.-': 'q',
      '.-.': 'r',
      '...': 's',
      '-': 't',
      '..-': 'u',
      '...-': 'v',
      '.--': 'w',
      '-..-': 'x',
      '-.--': 'y',
      '--..': 'z'
    };

    function morseletter2Text(t) {
      let morse = "";
      for(i = 0; i < t.length; i++) {
        if(morse_letters[t[i]]) {
          morse += morse_letters[t[i]] + " ";
        } else {
          morse += t[i] + " "
        }
      }
      return morse
    }
    let text = functions.text_block(morseletter2Text(args.join(" ")))
    if(text.length <= 4000) {
      return message.reply({
        content: text
      })
    } else {
      let txt = `././txt/${message.member.id}_morsecode_to_text.txt`
      await fs.writeFileSync(txt, text)

      await message.reply({
        content: `Morse Code To Text Too Long Created A .txt File`,
        files: [txt]
      })
      fs.unlinkSync(txt, (err) => {
        console.log(err)
      })
    }
  },
};

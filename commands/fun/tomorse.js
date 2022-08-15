const functions = require("../../functions.js")
let fs = require("fs")
module.exports = {
  name: "tomorse",
  permission: [],
  aliases: [],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  usage: ["$tomorse <text>"],
  description: "Make any text into morse code",

  run: async (client, message, args) => {
    if(!args.length) return message.reply({
      content: "Argument Missing: `text`"
    })
    let morse_letters = {
      '0': '-----',
      '1': '.----',
      '2': '..---',
      '3': '...--',
      '4': '....-',
      '5': '.....',
      '6': '-....',
      '7': '--...',
      '8': '---..',
      '9': '----.',
      A: '.-',
      B: '-...',
      C: '-.-.',
      D: '-..',
      E: '.',
      F: '..-.',
      G: '--.',
      H: '....',
      I: '..',
      J: '.---',
      K: '-.-',
      L: '.-..',
      M: '--',
      N: '-.',
      O: '---',
      P: '.--.',
      Q: '--.-',
      R: '.-.',
      S: '...',
      T: '-',
      U: '..-',
      V: '...-',
      W: '.--',
      X: '-..-',
      Y: '-.--',
      Z: '--..',
      a: '.-',
      b: '-...',
      c: '-.-.',
      d: '-..',
      e: '.',
      f: '..-.',
      g: '--.',
      h: '....',
      i: '..',
      j: '.---',
      k: '-.-',
      l: '.-..',
      m: '--',
      n: '-.',
      o: '---',
      p: '.--.',
      q: '--.-',
      r: '.-.',
      s: '...',
      t: '-',
      u: '..-',
      v: '...-',
      w: '.--',
      x: '-..-',
      y: '-.--',
      z: '--..'
    }

    function letter2Morse(t) {
      let morse = "";
      for(i = 0; i < t.length; i++) {
        if(morse_letters[t[i]]) {
          morse += morse_letters(t[i]) + " ";
        } else {
          morse += t[i] + " "
        }
      }
      return morse
    }
    let morsecode = functions.text_block(letter2Morse(args.join(" ")))
    if(morsecode.length <= 4000) {
      return message.reply({
        content: morsecode
      })
    } else {
      let txt = `././txt/${message.member.id}_morsecode.txt`
      await fs.writeFileSync(txt, morsecode)

      await message.reply({
        content: `Morse Code Text Too Long Created A .txt File`,
        files: [txt]
      })
      fs.unlinkSync(txt, (err) => {
        console.log(err)
      })
    }
  },
};

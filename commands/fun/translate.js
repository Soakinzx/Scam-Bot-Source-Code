const Discord = require("discord.js");
const translate = require('@iamtraction/google-translate')
let langs = {
  "english":'EN',
  "arabic":'AR',
  "spanish":'ES',
  "kurdish":'KU',
  "french":'FR',
  "japanese":'ja',
  "turkish": 'TR',
  "italian":'IT',
  'portuguese': "PT",
  'german': "DE",
  'dutch': "NL",
  'korean': "KO",
  'russian': "RU",
  'ukrainian': "UK"
}
module.exports = {
    name: "translate",
    aliases: [],
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    category: "fun",
    description: "translate to text to a language",
    usage: ["$translate <language to translate to> <text>"],
    run: async (client, message, args) => {
      if(!args[0]) return message.reply({content: "Argument Missing: `language: language to translate text to`"})
      let lang = args[0].toLowerCase()
      if(!langs[lang]) return message.reply({content: `Argument Invalid: 
      \`language: not a supported language, supported languages: ${Object.keys(langs).join("\n")}\``})
      args.shift()
      let text = args.join(" ")
      if(!text)return message.reply({content: "Argument Missing: `text: text to translate`"})
      translate(text, { to: langs[lang] }).then(res => {
        return message.channel.send({embeds: [{description: `${res.text}`, footer: {text: `Translated To ${langs[lang]}`}}]})
      }).catch(err => {
        console.log(err)
      })
    },
};
let file = '././txt/pokemon.txt'
let fs = require('fs');
const {
    Client,
    Intents,
    MessageEmbed,
    Collection,
    MessageButton,
    MessageActionRow,
    ButtonInteraction,
    MessageAttachment,
} = require("discord.js");
const closest_match = require("closest-match");
function match(str){
  let newstr = ""
  if(str.includes(" ")) {
    let words = str.split(" ")
    newstr = words[words.length-1]
  } else {
    newstr = str
  }
  let length = 0
    for(let c of newstr){
      if(["_", "-"].includes(c) || c.match(/([a-z])/)) {
        length++
        
      }
    }
  var pokemons = fs.readFileSync(file).toString().split("\n");
  let arr = pokemons.filter(p => p.length == length)
  
  
  
  let results = closest_match.closestMatch(newstr, arr, true)
  
  let obj_results = {
    result_1: results[0]? results[0] : "No Result",
    result_2: results[1]? results[1] : "No Result",
    result_3: results[2]? results[2] : "No Result",
  }
  return obj_results
}
let gdb = require("../Models/Guild")
module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
      if(!message.author.bot || message.author.id !== "716390085896962058" || !message.guild) return;
      let data = await gdb.findOne({_id: message.guild.id})
      if(!data || data.pokehelper == false) return;
      if(message.content.includes("The pokémon is") && message.content.split("The pokémon is")[1].includes("_")){
        let parr = message.content.split("The pokémon is")[1].toLowerCase().replace(".", "").replace(" ", "").split(" ")
        let res = match(parr[parr.length-1])
        let embed = new MessageEmbed()
        .setTitle("Pokemon Searcher")
        .addFields(
          Object.keys(res).map(k => {
            return {
              name: `${k.replace("_", " ")}`,
              value: `${res[k]}`
            }
          })
        )
        message.channel.send({embeds: [embed]})
      }
      
    },
};
let discord = require("discord.js")
let functions = require("../../functions.js")
let fs = require("fs")
let file = "././txt/words.txt"
module.exports = {
  name: "greentea",
  aliases: [],
  permission: [],
  category: "games",
  req_perms: ["SEND_MESSAGES"],
  description: "greentea",
  usage: ["$greentea"],
  run: async (client, message, args) => {
    //return message.reply({content: "Being worked on..."})
    
    if (client.ingame.includes(message.member.id)) return message.reply({
      content: `You are already in a game`
    })
    client.ingame.push(message.member.id)
    let host = message.member
    let player_who_found = null
    let players = [{user: message.member, points: 0}]
    let max_players = 10
    let start_amount = 2
    let points_needed = 30

    
    let words = fs.readFileSync(file).toString().split("\n");

    function check(content) {
      filtered_words = words.filter(word => word.length == content.length)
      for(let i=0;i<filtered_words.length;i++){
        if(filtered_words[i].toLowerCase() == content.toLowerCase()) {
          return true
        }
      }
      return false
    }
    async function end(){
      players.forEach(plr => {
        if(client.ingame.includes(plr.user.id)){
          client.ingame.splice(client.ingame.indexOf(plr.user.id),1)
        }
      })
    }
    
    async function game() {
      let letters = words.filter(word => word.length >= 6)[Math.floor(Math.random() * words.filter(word => word.length >= 6).length)].slice(0, 3).toLowerCase()

      message.channel.send({
        content: `players spell a word that starts with the letters **${letters.toUpperCase()}**`
      })
      let word_found = false
      let collector = message.channel.createMessageCollector({
        time: 10000,
        filter: ({
          member
        }) => players.find(plr => plr.user == member)
      })
      collector.on("collect", async (m) => {
        let content = m.content
        if (content.toLowerCase().startsWith(letters) && check(content.toLowerCase()) == true) {
          word_found = true
          player_who_found = players.find(plr => plr.user == m.member)
          player_who_found.points += 1
          return collector.stop()
        }
      })

      collector.on("end", async (collected) => {
        if (collected.size == 0) {
          message.channel.send({
            content: `Nobody found a word`
          })
          return game()
        }
        if (word_found == true) {
          message.channel.send({
            content: `${player_who_found.user} Got It! You now have \`${player_who_found.points}\` points`
          })
          if(player_who_found.points == points_needed){
            end()
            return message.channel.send({content: `${player_who_found.user} has won the game with \`${points_needed}\` points!`})
            
          } else {
            return game()
          }
        } else {
          message.channel.send({content: `Nobody found a word`})
          return game()
        }
      })
    }
    let start = async () => {
      message.channel.send({
        content: "Game Started"
      })
      game()
    }




    let queue_embed = new discord.MessageEmbed()
      .setTitle("Waiting Queue")
      .setDescription(`${host} is hosting a game of greentea..join fast before the timer ends in 60 seconds`)
      .setFooter(`Players ${players.length}/${max_players}`)
      .setColor("DARK_BUT_NOT_BLACK")

    let queue_row = new discord.MessageActionRow()
      .addComponents(
        new discord.MessageButton()
        .setCustomId("join")
        .setLabel("Join")
        .setStyle("SUCCESS"),
        new discord.MessageButton()
        .setCustomId("leave")
        .setLabel("Leave")
        .setStyle("DANGER"),
        new discord.MessageButton()
        .setCustomId("start")
        .setLabel("Start")
        .setStyle("SECONDARY"),
        new discord.MessageButton()
        .setCustomId("end")
        .setLabel("End")
        .setStyle("DANGER")
      )
    let queue_message = await message.channel.send({
      embeds: [queue_embed],
      components: [queue_row]
    })
    
    let secs = 20
    let game_started = false
    let game_ended = false
    let queue_collector = queue_message.createMessageComponentCollector({
      type: "BUTTON",
      time: 60000
    })
    queue_collector.on("collect", async (i) => {


      if (i.customId == "join") {
        
        if(client.ingame.includes(i.member.id)) {
          return i.reply({
            content: `you are already in a game`,
            ephemeral: true
          })
        }
        players.push({user: i.member, points: 0})
        client.ingame.push(i.member.id)
        await functions.temp_message(message, {
          content: `${i.member} joined the game`
        }, secs)
        let embed = functions.edit_embed(queue_embed, "footer", `Players ${players.length}/${max_players}`)
        i.update({
          embeds: [embed]
        })
        if (players.length == max_players) {
          game_started = true
          queue_collector.stop()
        }
      }

      if (i.customId == "leave") {
        if (!players.find(plr => plr.user == i.member)) return i.reply({
          content: "You have not joined the game",
          ephemeral: true
        })
        if(client.ingame.includes(i.member.id)){
            client.ingame.splice(client.ingame.indexOf(i.member.id),1)
        }
        if (i.member == host) {
          players.splice(players.indexOf(players.find(plr => plr.user == i.member)), 1)
          
          if (players.length == 0) {
            
            message.channel.send({
              content: `${i.member} has left the game, no players left to play the game, game ended`
            })
            let embed = functions.edit_embed(queue_embed, "footer", `Players ${players.length}/${max_players}`)
            
            game_ended = true
            queue_collector.stop()
            return i.update({
              embeds: [embed]
            })
          } else {
            
            host = players[0]
            
            await functions.temp_message(message, {
              content: `${i.member} has left the game, host transferred to ${host}`
            }, secs)
            let embed = functions.edit_embed(queue_embed, "footer", `Players ${players.length}/${max_players}`)
            return i.update({
              embeds: [embed]
            })
          }

        } else {

          players.splice(players.indexOf(players.find(plr => plr.user == i.member)), 1)

          if (players.length == 0) {
            message.channel.send({
              content: `${i.member} has left the game, no players left to play the game, game ended`
            })
            let embed = functions.edit_embed(queue_embed, "footer", `Players ${players.length}/${max_players}`)
            game_ended = true
            queue_collector.stop()
            return i.update({
              embeds: [embed]
            })
          } else {
            
            await functions.temp_message(message, {
              content: `${i.member} has left the game`
            }, secs)
            let embed = functions.edit_embed(queue_embed, "footer", `Players ${players.length}/${max_players}`)
            return i.update({
              embeds: [embed]
            })
          }

        }
        

      }

      if (i.customId == "end") {
        if (i.member == host) {
          i.deferUpdate()
          game_ended = true
          queue_collector.stop()
          
          return message.channel.send({
            content: `${host} has ended the game`
          })
        } else {
          return i.reply({
            content: `You are not the host of this game`,
            ephemeral: true
          })
        }
      }

      if (i.customId == "start") {
        if (i.member == host) {
          if (players.length < start_amount) {
            return i.reply({
              content: `Not enough players to start...`,
              ephemeral: true
            })
          }
          i.deferUpdate()
          message.channel.send({
            content: `${host} has started the game`
          })
          game_started = true
          return queue_collector.stop()
        } else {
          return message.channel.send({
            content: `You are not the host of this game`,
            ephemeral: true
          })
        }
      }
    })

    queue_collector.on("end", (collected) => {
      queue_message.edit({
        components: functions.disable_all_components(queue_message)
      })
      if(game_started == false && game_ended == false && players.length >= start_amount){
        let embed = functions.edit_embed(queue_embed, "description", `Game Timer Ended, Starting game...`)
        start()
        queue_message.edit({
          embeds: [embed]
        })
      } else if (collected.size == 0) {
        let embed = functions.edit_embed(queue_embed, "description", `Game Timer Ended, Not enough players to play...`)
        end()
        queue_message.edit({
          embeds: [embed]
        })
      } else {
        if (players.length == 0 && game_ended == false) {
          let embed = functions.edit_embed(queue_embed, "description", `Game Timer Ended, Not enough players to play...`)
          end()
          queue_message.edit({
            embeds: [embed]
          })
        } else if (players.length >= start_amount && game_started == true) {
          let embed = functions.edit_embed(queue_embed, "description", `Game Started By Host`)
          queue_message.edit({
            embeds: [embed]
          })
          start()
        } else if (players.length == 0 && game_ended == true) {
          let embed = functions.edit_embed(queue_embed, "description", `Game Ended By Host`)
          end()
          queue_message.edit({
            embeds: [embed]
          })
        } else if(game_started == false && game_ended == false && players.length < start_amount){
          let embed = functions.edit_embed(queue_embed, "description", `Game Timer Ended, Not enough players to play...`)
          end()
          queue_message.edit({
            embeds: [embed]
          })
        } else if(game_ended == true && players.length >= 1){
          let embed = functions.edit_embed(queue_embed, "description", `Game Ended By Host`)
          end()
          queue_message.edit({
            embeds: [embed]
          })
        }
      }
    })
    
  },
};
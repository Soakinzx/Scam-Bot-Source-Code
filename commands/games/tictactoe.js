const discord = require("discord.js");
const functions = require("../../functions.js")
module.exports = {
    name: "tictactoe",
    aliases: ["ttt"],
    permission: [],
    category: "games",
    description: "tictactoe game",
    usage: ["$tictactoe <user>"],
    run: async (client, message, args) => {
      return message.reply({content: "Being worked on"})
      /*
      let cp = message.member
      let p2 = message.mentions.members.first()
      if(client.ingame.includes(message.member.id)) return message.reply({content: `You are already in a game`})
      if(client.ingame.includes(p2.id)) return message.reply({content: `${p2} is already in a game`})

      */
    },
};
/*
let board = {
        a: ["-", "-", "-"],
        b: ["-", "-", "-"],
        c: ["-", "-", "-"]
      }
      let row1 = new discord.MessageActionRow().addComponents(
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("a1"),
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("a2"),
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("a3")
      )
      
      let row2 = new discord.MessageActionRow().addComponents(
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("b1"),
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("b2"),
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("b3")
      )
      
      let row3 = new discord.MessageActionRow().addComponents(
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("c1"),
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("c2"),
        new discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("-")
        .setCustomId("c3")
      )
      
      let symbol = "X"
*/
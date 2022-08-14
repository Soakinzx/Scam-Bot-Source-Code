const {
  MessageEmbed,
  MessageButton,
  MessageActionRow
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")
/*
let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      return message.reply({content: ``})
    }
*/
module.exports = {
  name: "reset",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$reset"],
  description: "enable autorole",
  run: async (client, message, args) => {
    let row = new MessageActionRow()
      .addComponents(
      new MessageButton()
      .setCustomId("y")
      .setLabel("Yes")
      .setStyle("SUCCESS"),
      new MessageButton()
      .setCustomId("n")
      .setLabel("No")
      .setStyle("DANGER")
    )
    let embed = {
      title: "Confirmation",
      description: "Are You Sure You Want To Reset This Servers Data Saved By Scam Including `Configurations, Anti, Info, Etc.`"
    }

    let msg = await message.reply({embeds: [embed], components: [row]})

    async function reset(){
      await functions.reset(gdb, {_id: message.guild.id})
      return msg.reply({content: `Server Data Successfully Reset`})
    }

    let collector = msg.createMessageComponentCollector({
      time: 15000,
      filter: ({user, reply}) => {
        if(user.id == message.author.id) {
          return true
        } else {
          reply({content: "You cannot use this button", ephemeral: true})
        }
      }
    })

    collector.on("collect", async (i) => {
      if(i.customId == "y"){
        embed.description = "Server Data Resetting..."
        i.update({embeds: [embed]})
        await reset()
        collector.stop()
      } else if(i.customId == "n"){
        embed.description = "Server Data Reset Canceled"
        i.update({embeds: [embed]})
        collector.stop()
      }
    })

    collector.on("end", async (c) => {
      if(c.size == 0){
        embed.description = "Time Ran Out, No Response..."
      }
      let comps = await functions.disable_all_components(msg)
      msg.edit({embeds: [embed], components: comps})
    })
  },
}

let discord = require("discord.js")
module.exports = {
  name: "russianroulette",
  aliases: ["rs"],
  permission: [],
  category: "games",
  req_perms: ["SEND_MESSAGES"],
  description: "russian roulette game",
  usage: ["$russianroulette <user>"],
  run: async (client, message, args) => {
    let p1 = message.member
    let p2 = message.mentions.members.first() || null
    if(client.ingame.includes(p1.id)) return message.reply({content: `You are already in a game`})
    if(client.ingame.includes(p2.id)) return message.reply({content: `${p2} is already in a game`})
    let cp = message.member
    if (!p2) return message.reply({
      content: `Must specify a user to play with`
    })
    if (p2 == message.member) return message.reply({
      content: `Cannot play against yourself`
    })

    function switchuser(current) {
      if (current == p1) {
        return p2
      } else {
        return p1
      }
    }
    let accept = async (msg) => {
      client.ingame.push(p1.id)
      client.ingame.push(p2.id)
      let max_cartridges = 6
      let count = max_cartridges
      let killed = null


      let embed = new discord.MessageEmbed()
        .setTitle("Russian Roulette")
        .setDescription(`${cp}'s turn`)
        .setFooter(`${count}/${max_cartridges} cartridges`)
      let btn_row = new discord.MessageActionRow()
        .addComponents(
          new discord.MessageButton()
          .setStyle("PRIMARY")
          .setCustomId("shoot")
          .setLabel("Shoot")
        )
      let btn_message = await message.channel.send({
        embeds: [embed],
        components: [btn_row]
      })
      let btn_collector = btn_message.createMessageComponentCollector({
        componentType: "BUTTON",
        filter: ({
          user,
          reply
        }) => {
          if ([p1.id, p2.id].includes(user.id)) {
            return true
          } else {
            return false
          }
        }
      })
      btn_collector.on("collect", async (i) => {
        if (count == 0) return btn_collector.stop()
        if (i.user.id == cp.id && i.customId == "shoot" && count !== 0) {
          count -= 1
          if (count == 0) return btn_collector.stop()
          let bullet = Math.floor(Math.random() * (2 - 0) + 0)
          if (bullet == 1) {
            killed = true
            let embed = new discord.MessageEmbed()
              .setTitle("Russian Roulette")
              .setDescription(`${cp} Shoots the revolver...The revolver goes off, ${cp} is now dead`)
              .setFooter(`${count}/${max_cartridges} cartridges`)
            let row = new discord.MessageActionRow()
              .addComponents(
                new discord.MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("shoot")
                .setLabel("Shoot")
                .setDisabled(true)
              )
            i.update({
              embeds: [embed],
              components: [row]
            })
            return btn_collector.stop()
          } else {
            cp = switchuser(cp)

            let embed = new discord.MessageEmbed()
              .setTitle("Russian Roulette")
              .setDescription(`${switchuser(cp)} Shoots the gun...The Revolver didnt go off, ${cp}'s turn`)
              .setFooter(`${count}/${max_cartridges} cartridges`)
            i.update({
              embeds: [embed]
            })
          }
        } else if (i.user.id !== cp.id && i.customId == "shoot" && count !== 0) {
          return i.reply({
            content: "Wait your turn...",
            ephemeral: true
          })
        }
      })
      btn_collector.on("end", async (collected) => {
        client.ingame.splice(client.ingame.indexOf(p1.id),1)
        client.ingame.splice(client.ingame.indexOf(p2.id),1)
        if (count == 0 && killed == null) {
          let embed = new discord.MessageEmbed()
            .setTitle("Russian Roulette")
            .setDescription(`Revolver's Cartridges Are Empty, Nobody died!!!`)
            .setFooter(`${count}/${max_cartridges} cartridges`)
          let row = new discord.MessageActionRow()
            .addComponents(
              new discord.MessageButton()
              .setStyle("PRIMARY")
              .setCustomId("shoot")
              .setLabel("Shoot")
              .setDisabled(true)
            )
          return btn_message.edit({
            embeds: [embed],
            components: [row]
          })
        }
      })
    }



    let request_embed = new discord.MessageEmbed()
      .setTitle("Request")
      .setDescription(`${p1} wants to play russian roulette with you, do you accept ${p2}?`)
      .setColor("DARK_BUT_NOT_BLACK")

    let request_row = new discord.MessageActionRow()
      .addComponents(
        new discord.MessageButton()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle("SUCCESS"),
        new discord.MessageButton()
        .setCustomId("deny")
        .setLabel("Deny")
        .setStyle("DANGER")
      )
    let request_message = await message.channel.send({
      embeds: [request_embed],
      components: [request_row]
    })

    let request_collector = request_message.createMessageComponentCollector({
      max: 1,
      componentType: "BUTTON",
      time: 60000,
      filter: ({
        user
      }) => user.id === p2.id
    })
    request_collector.on("collect", async (i) => {
      let row = new discord.MessageActionRow()
        .addComponents(
          new discord.MessageButton()
          .setCustomId("accept")
          .setLabel("Accept")
          .setStyle("SUCCESS")
          .setDisabled(true),
          new discord.MessageButton()
          .setCustomId("deny")
          .setLabel("Deny")
          .setStyle("DANGER")
          .setDisabled(true)
        )
      if (i.customId == "accept") {
        accept(request_message)
        let embed = new discord.MessageEmbed()
          .setTitle("Request")
          .setDescription(`${p2} accepted your request ${p1}`)
          .setColor("DARK_BUT_NOT_BLACK")

        return i.update({
          embeds: [embed],
          components: [row]
        })
      } else if (i.customId == "deny") {
        let embed = new discord.MessageEmbed()
          .setTitle("Request")
          .setDescription(`${p2} denied your request ${p1}`)
          .setColor("DARK_BUT_NOT_BLACK")
        return i.update({
          embeds: [embed],
          components: [row]
        })
      }
    })

    request_collector.on("end", (collected) => {
      if (collected.size == 0) {
        let row = new discord.MessageActionRow()
          .addComponents(
            new discord.MessageButton()
            .setCustomId("accept")
            .setLabel("Accept")
            .setStyle("SUCCESS")
            .setDisabled(true),
            new discord.MessageButton()
            .setCustomId("deny")
            .setLabel("Deny")
            .setStyle("DANGER")
            .setDisabled(true)
          )
        let embed = new discord.MessageEmbed()
          .setTitle("Request")
          .setDescription(`${p2} didnt answer your request in time ${p1}`)
          .setColor("DARK_BUT_NOT_BLACK")
        request_message.edit({
          embeds: [embed],
          components: [row]
        })
      } else {
        return;
      }
    })
  },
};
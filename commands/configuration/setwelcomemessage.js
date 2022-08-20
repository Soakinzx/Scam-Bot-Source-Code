const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent
} = require("discord.js");


const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")


module.exports = {
  name: "setwelcomemessage",
  aliases: ["setwelcomemsg", "editwelcomemessage", "editwelcomemsg"],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$setwelcomemessage"],
  description: "set the welcome message for when a user joins",
  run: async (client, message, args) => {
    //return message.reply({content: "Being worked on..."})
    //if (!client.owners.includes(message.member.id)) return message.reply({
   //   content: "Being worked on..."
    //})
    let embed = {
      title: "Welcome Messgae",
      description: 'Choose A Button To Edit The Corresponding Data'
    }
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data) {
      data = new gdb(gs)
      data.save()
      return message.reply({
        content: "Data for server not found, created data for server, please try this command again!"
      })
    }
    let estyles = {
      true: ["DANGER", "Disable Embed"],
      false: ["SUCCESS", "Enable Embed"]
    }
    let tstyles = {
      true: ["DANGER", "Disable Text"],
      false: ["SUCCESS", "Enable Text"]
    }
    let estyle = estyles[data.welcome_message.embed_enabled][0]
    let elbl = estyles[data.welcome_message.embed_enabled][1]
    let tstyle = tstyles[data.welcome_message.text_enabled][0]
    let tlbl = tstyles[data.welcome_message.text_enabled][1]
    let row = new MessageActionRow().addComponents(
      new MessageButton()
      .setLabel("Embed")
      .setCustomId("embed")
      .setStyle("SECONDARY"),
      new MessageButton()
      .setLabel("Text")
      .setCustomId("text")
      .setStyle("SECONDARY"),
      new MessageButton()
      .setLabel("Embed Image")
      .setCustomId("image")
      .setStyle("SECONDARY"),
      new MessageButton()
      .setLabel("Embed Thumbnail")
      .setCustomId("thumbnail")
      .setStyle("SECONDARY"),
      new MessageButton()
      .setLabel(elbl)
      .setCustomId("enable_embed")
      .setStyle(estyle)
    )
    let row2 = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel(tlbl)
        .setCustomId("enable_text")
        .setStyle(tstyle),
        new MessageButton()
        .setLabel("Done")
        .setCustomId("done")
        .setStyle("PRIMARY")
      )

    let msg = await message.channel.send({
      embeds: [embed],
      components: [row, row2]
    })


    //if(argument.length > 128) return message.reply({content: `Argument invalid: \`message: must be less than 128 characters\``})

    let collector = await msg.createMessageComponentCollector({
      time: 5 * 60000,
      filter: ({
        user, reply
      }) => user.id == message.member.id
    })

    collector.on("collect", async (i) => {
      if(i.customId == "done"){
        if(client.editing_welcome.includes(i.user.id)){
          client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
        }
        i.component.setStyle("DANGER")
        collector.stop()
        return i.reply({content: "Welcome Message Editor Stopped"})
      } else if (i.customId == "embed") {
        const modal = new Modal()
          .setCustomId('welcome_modal')
          .setTitle('Welcome Message')

        const title = new TextInputComponent()
          .setCustomId("title")
          .setMaxLength(256)
          .setRequired(true)
          .setStyle(2)
          .setPlaceholder('type "ignore" to ignore, type "remove" to remove the value set')
          .setLabel('Title')

        const description = new TextInputComponent()
          .setCustomId("description")
          .setMaxLength(4000)
          .setRequired(true)
          .setStyle(2)
          .setPlaceholder('type "ignore" to ignore, type "remove" to remove the value set')
          .setLabel('Description')

        const footer = new TextInputComponent()
          .setCustomId("footer")
          .setMaxLength(2048)
          .setRequired(true)
          .setStyle(2)
          .setPlaceholder('type "ignore" to ignore, type "remove" to remove the value set, ex. {user.id} ++ {user.avatar}')
          .setLabel('Footer')

        const author = new TextInputComponent()
          .setCustomId("author")
          .setMaxLength(256)
          .setRequired(true)
          .setStyle(2)
          .setPlaceholder('type "ignore" to ignore, type "remove" to remove the value set, ex. {user.tag} ++ {user.avatar}')
          .setLabel('Author')

        const color = new TextInputComponent()
          .setCustomId("color")
          .setMaxLength(100)
          .setRequired(true)
          .setLabel('Color')
          .setStyle(2)
          .setPlaceholder('type "ignore" to ignore, type "remove" to remove the value set')


        const TitleActionRow = new MessageActionRow().addComponents([title]);
        const DescActionRow = new MessageActionRow().addComponents([description]);
        const FooterActionRow = new MessageActionRow().addComponents([footer]);
        const AuthorActionRow = new MessageActionRow().addComponents([author]);
        const ColorActionRow = new MessageActionRow().addComponents([color]);

        modal.addComponents([TitleActionRow, DescActionRow, FooterActionRow, AuthorActionRow, ColorActionRow]);

        // Show the modal to the user

        await i.showModal(modal);
      } else if (i.customId == "enable_embed") {
        if (data.welcome_message.embed_enabled == false) {
          let wmsg = functions.cloneobj(data.welcome_message)
          wmsg.embed_enabled = true
          data.welcome_message = wmsg
          data.save()
        } else {
          let wmsg = functions.cloneobj(data.welcome_message)
          wmsg.embed_enabled = false
          data.welcome_message = wmsg
          data.save()
        }
        i.component.setStyle(estyles[data.welcome_message.embed_enabled][0])
        i.component.setLabel(estyles[data.welcome_message.embed_enabled][1])
        i.update({
          components: msg.components
        })
      } else if (i.customId == "enable_text") {
        if (data.welcome_message.text_enabled == false) {
          let wmsg = functions.cloneobj(data.welcome_message)
          wmsg.text_enabled = true
          data.welcome_message = wmsg
          data.save()
        } else {
          let wmsg = functions.cloneobj(data.welcome_message)
          wmsg.text_enabled = false
          data.welcome_message = wmsg
          data.save()
        }
        i.component.setStyle(tstyles[data.welcome_message.text_enabled][0])
        i.component.setLabel(tstyles[data.welcome_message.text_enabled][1])
        i.update({
          components: msg.components
        })
      } else if (i.customId == "text") {
        if(!client.editing_welcome.includes(i.user.id)){
          client.editing_welcome.push(i.user.id)
        } else {
          return i.reply({content: "You are already editing one of the following `embed image, embed thumbnail, text` please finish with the current choice selected before this one to select this choice", ephemeral: true})
        }
        i.reply({content: `Enter A Text, type "cancel" to cancel setting the text`, ephemeral: true})
        const msg_filter = (m) => m.author.id === message.author.id;
        const collected = await message.channel.awaitMessages({
          filter: msg_filter,
          max: 1
        });
        let arr = []
        collected.map(c => {
          arr.push(c)
        })
        if(!arr[0].content) {
          client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
          return message.reply({content: 'Message Content Not Found Try Again By Clicking `Text` Button Again'})
        }
        if(arr[0] && arr[0].content){
          if(arr[0].content.toLowerCase() == "cancel"){
            client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
            return message.reply({content: "Text Collector Cancelled"})
          }
        }
        let content = arr[0].content
        if(content.length > 2000) return message.reply({content: 'Text Must Be Less Than Or Equal To `2000` Try Again By Clicking `Text` Button Again'})
        let wmsg = functions.cloneobj(data.welcome_message)
        wmsg.content = content
        data.welcome_message = wmsg
        data.save()
        message.reply({content: 'Text Set'})
        client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
      } else if (i.customId == "image") {
        if(!client.editing_welcome.includes(i.user.id)){
          client.editing_welcome.push(i.user.id)
        } else {
          return i.reply({content: "You are already editing one of the following `embed image, embed thumbnail, text` please finish with the current choice selected before this one to select this choice", ephemeral: true})
        }
        i.reply({content: 'Enter A URL/Attachment/Variable or type "remove" to remove the value set, type "cancel" to cancel setting the embed image', ephemeral: true})
        const msg_filter = (m) => m.author.id === message.author.id;
        const collected = await message.channel.awaitMessages({
          filter: msg_filter,
          max: 1
        });
        let arr = []
        collected.map(c => {
          arr.push(c)
        })
        if(!arr[0].content && arr[0].attachments.size == 0) {
          client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
          return message.reply({content: 'Message Content And Attachment Not Found Try Again By Clicking `Embed Image` Button Again'})
        }
        if(arr[0] && arr[0].content){
          if(arr[0].content.toLowerCase() == "cancel"){
            client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
            return message.reply({content: "Image Collector Cancelled"})
          }
        }
        let urls = []
        arr[0].attachments.forEach(img => {
          urls.push(img.url)
        })
        let image = (urls[0]) ? urls[0] : arr[0].content
        if(image.length > 2000) return message.reply({content: 'Link Must Be Less Than Or Equal To `2000` Try Again By Clicking `Embed Image` Button Again'})
        let wmsg = functions.cloneobj(data.welcome_message)
        let embed = functions.cloneobj(wmsg.embed)
        let img = {
          url: null
        }
        img.url = (image.toLowerCase() == "remove") ? null : image
        embed.image = img
        wmsg.embed = embed
        data.welcome_message = wmsg
        data.save()
        client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
        if(image.toLowerCase() == "remove"){
          message.reply({content: 'Image removed'})
        } else {
          message.reply({content: 'Image Set, If It Does Not Appear/Appear Properly Make Sure You Provided A Valid URL/Attachment/Variable'})
        }
      } else if (i.customId == "thumbnail") {
        if(!client.editing_welcome.includes(i.user.id)){
          client.editing_welcome.push(i.user.id)
        } else {
          return i.reply({content: "You are already editing one of the following `embed image, embed thumbnail, text` please finish with the current choice selected before this one to select this choice", ephemeral: true})
        }
        i.reply({content: 'Enter A URL/Attachment/Variable or type "remove" to remove the value set, type "cancel" to cancel setting the embed thumbnail', ephemeral: true})
        const msg_filter = (m) => m.author.id === message.author.id;
        const collected = await message.channel.awaitMessages({
          filter: msg_filter,
          max: 1
        });
        let arr = []
        collected.map(c => {
          arr.push(c)
        })
        if(!arr[0].content && arr[0].attachments.size == 0) {
          client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
          return message.reply({content: 'Message Content And Attachment Not Found Try Again By Clicking `Embed Thumbnail` Button Again'})
        }
        if(arr[0] && arr[0].content){
          if(arr[0].content.toLowerCase() == "cancel"){
            client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
            return message.reply({content: "Thumbnail Collector Cancelled"})
          }
        }
        let urls = []
        arr[0].attachments.forEach(img => {
          urls.push(img.url)
        })
        let thumbnail = (urls[0]) ? urls[0] : arr[0].content
        if(thumbnail.length > 2000) return message.reply({content: 'Link Must Be Less Than Or Equal To `2000` Try Again By Clicking `Embed Image` Button Again'})
        let wmsg = functions.cloneobj(data.welcome_message)
        let embed = functions.cloneobj(wmsg.embed)
        let thumb = {
          url: null
        }
        thumb.url = (thumbnail.toLowerCase() == "remove") ? null : thumbnail
        embed.thumbnail = thumb
        wmsg.embed = embed
        data.welcome_message = wmsg
        data.save()
        client.editing_welcome.splice(client.editing_welcome.indexOf(i.user.id),1)
        if(thumbnail.toLowerCase() == "remove"){
          message.reply({content: 'Thumbnail removed'})
        } else {
          message.reply({content: 'Thumbnail Set, If It Does Not Appear/Appear Properly Make Sure You Provided A Valid URL/Attachment/Variable'})
        }
      }
    })

    collector.on("end", c => {
      let comps = functions.disable_all_components(msg)

      msg.edit({components: comps})
    })

  },
}
//client.editing_welcome

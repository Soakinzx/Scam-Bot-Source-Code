const {
  Discord,
  MessageEmbed
} = require("discord.js");
module.exports = {
  name: "editrole",
  aliases: [],
  permission: ["MANAGE_ROLES"],
  category: "moderation",
  req_perms: ["MANAGE_ROLES", "SEND_MESSAGES"],
  usage: ["$editrole <role> <property> <data>"],
  description: "edit a role",
  run: async (client, message, args) => {
    if(!args.join(" ")) return message.reply({
      content: "Argument Missing: `@role`"
    })
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase()
      .startsWith(args[0]
        .toLowerCase()))
    if(!role) return message.reply({
      content: "Argument Invalid: `@role`"
    })
    if(message.member.roles.highest.comparePositionTo(role) <= 0 && message.guild.ownerId !== message.member.id) return message.reply({
      content: `\`${role.name}\` role has higher/equal authority than your current highest role`
    })

    if(message.guild.me.roles.highest.comparePositionTo(role) < 0) return message.reply({
      content: `\`${role.name}\` role has higher authority than my current highest role`
    })
    
    let properties = ["name", "color", "hoisted", "mentionable", "position"]
    //need to add:  "unicodeemoji", "icon", "permissions"
    let property = args[1]
    if(!property) return message.reply({content: `Argument Missing: \`property: supported properties: ${properties.join("\n")}\``})
    property = property.toLowerCase()
    if(!properties.includes(property)) return message.reply({content: `Argument Invalid: \`property: supported properties: ${properties.join("\n")}\``})
    
      if(property == "name") {
          let new_name = args.splice(2).join(" ")
          let old_name = role.name
          if(!new_name) return message.reply({content: "Argument Missing: `new role name`"})
          if(new_name.length > 32) return message.reply({content: "Argument Invalid: `new role name: must be less than or equal to 32 characters`"})
          role.setName(new_name).then(() => {
              return message.reply({content: `Set the role **${old_name}** name as \`${new_name}\``})
          }).catch(err => {
              return message.reply({content: `${err}`})
          })
      } else if(property == "color"){
          let new_color = args.splice(2).join("_")
          let old_color = role.hexColor
          if(!new_color) return message.reply({content: "Argument Missing: `new role color`"})
          new_color = new_color.toUpperCase()
          role.setColor(new_color).then(() => {
              return message.reply({content: `Set the role **${role.name}** color **${old_color}** as \`${role.hexColor}\``})
          }).catch(err => {
              return message.reply({content: `${err}`})
          })
      } else if(property == "position") {
          let new_pos = args.splice(2).join(" ")
          let old_pos = role.position
          if(!new_pos) return message.reply({content: "Argument Missing: `new role position`"})
          if(isNaN(new_pos)) return message.reply({content: "Argument Invalid: `new role position: must be an integer`"})
          new_pos = parseInt(new_pos)
          if(new_pos >= message.guild.me.roles.highest.position) return message.reply({content: `Cannot set the role **${role.name}** position greater than or equal to my current highest role position **${message.guild.me.roles.highest.position}**`})
          role.setPosition(new_pos).then(() => {
              return message.reply({content: `Set the role **${role.name}** position **${old_pos}** as \`${role.position}\``})
          }).catch(err => {
              return message.reply({content: `${err}`})
          })
      } else if(property == "mentionable") {
          let setting = args.splice(2).join(" ")
          let settings = {
              "true": true,
              "false": false
          }
          if(!setting) return message.reply({content: "Argument Missing: `toggle role mentionable: true, false`"})
          setting = setting.toLowerCase()
          if(!Object.keys(settings).includes(setting)) return message.reply({content: "Argument Invalid: `toggle role mentionable: supported settings: true, false`"})
          role.setMentionable(settings[setting]).then(() => {
              return message.reply({content: `Toggled the role **${role.name}** mentionable \`${role.mentionable}\``})
          }).catch(err => {
              return message.reply({content: `${err}`})
          })
      } else if(property == "hoisted") {
          let setting = args.splice(2).join(" ")
          let settings = {
              "true": true,
              "false": false
          }
          if(!setting) return message.reply({content: "Argument Missing: `toggle role hoisted: true, false`"})
          setting = setting.toLowerCase()
          if(!Object.keys(settings).includes(setting)) return message.reply({content: "Argument Invalid: `toggle role hoisted: supported settings: true, false`"})
          role.setHoist(settings[setting]).then(() => {
              return message.reply({content: `Toggled the role **${role.name}** hoisted \`${role.hoist}\``})
          }).catch(err => {
              return message.reply({content: `${err}`})
          })
      }

  },
}

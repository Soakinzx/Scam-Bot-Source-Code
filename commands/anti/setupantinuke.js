const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "setupantinuke",
  aliases: ["configantinuke", "configureantinuke"],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  usage: ["$setamountofmessagespertime 10"],
  description: "configure anti message settings",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    /*
    [
      'channels_deleted_before_time',
      'channels_deleted_time',
      'channels_created_before_time',
      'channels_created_time',
      'roles_deleted_before_time',
      'roles_deleted_time',
      'roles_created_before_time',
      'roles_created_time',
      'members_kicked_before_time',
      'members_kicked_time',
      'members_banned_before_time',
      'members_banned_time',
      'quaratine_on_dangerous_permissions_added',
      'quaratine_on_dangerous_roles_added',
      'quartine_on_editing_quartine_role'
    ]
    antinukesettings: {
    channels_deleted_before_time_before_quarantine: 1,
    channels_deleted_time: 5,
    channels_created_before_time_before_quarantine: 1,
    channels_created_time: 5,
    roles_deleted_before_time_before_quarantine: 1,
    roles_deleted_time: 5,
    roles_created_before_time_before_quarantine: 1,
    roles_created_time: 5,
    members_kicked_before_time_before_quarantine: 1,
    members_kicked_time: 5,
    members_banned_before_time_before_quarantine: 1,
    members_banned_time: 5,
    quarantine_on_dangerous_permissions_added: true,
  }
      */
    let actions = [
      'channels_deleted_before_time',
      'channels_deleted_time',
      'channels_created_before_time',
      'channels_created_time',
      'roles_deleted_time',
      'roles_deleted_before_time',
      'members_kicked_before_time',
      'members_kicked_time',
      'members_banned_before_time',
      'members_banned_time',
      'quarantine_on_dangerous_permissions_added'
    ]
    if (!args[0]) return message.reply({
      content: `Argument Missing: \`action: ${actions.join(", ")}\``
    })

    let action = args[0].toLowerCase()
    if (!actions.includes(action)) return message.reply({
      content: `Argument Invalid: \`action: ${actions.join(", ")}\``
    })
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data) {
      data = new gdb(gs)
      data.save()
      return message.reply({content: "Data not found...New data created...Please run this command again"})
    } else {
      
      let obj = functions.cloneobj(data.antinukesettings)
      if (action == "channels_deleted_before_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 100 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 100 and greater than or equal to 1`"
          })
        }
        obj.channels_deleted_before_time_before_quarantine = argument
        message.reply({content: `Set Anti-Nuke Settings Channels Deleted Before Time \`${argument}\``})
      } 
      else if (action == "channels_deleted_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.channels_deleted_time = argument
        message.reply({content: `Set Anti-Nuke Settings Channels Deleted Time \`${argument}\``})
      } 
      else if (action == "channels_created_before_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 100 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 100 and greater than or equal to 1`"
          })
        }
        obj.channels_created_before_time_before_quarantine = argument
        message.reply({content: `Set Anti-Nuke Settings Channels Created Before Time \`${argument}\``})
      } 
      else if (action == "channels_created_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.channels_deleted_time = argument
        message.reply({content: `Set Anti-Nuke Settings Channels Created Time \`${argument}\``})
      }
      else if (action == "roles_deleted_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.roles_deleted_time = argument
        message.reply({content: `Set Anti-Nuke Settings Roles Deleted Time Set To \`${argument}\``})
      } 
      else if (action == "roles_deleted_before_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.roles_deleted_before_time_before_quarantine = argument
        message.reply({content: `Set Anti-Nuke Settings Roles Deleted Before Time Set To \`${argument}\``})
      } 
      else if (action == "roles_created_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.roles_created_time = argument
        message.reply({content: `Set Anti-Nuke Settings Roles Created Time Set To \`${argument}\``})
      }
      else if(action == "roles_created_before_time"){
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.roles_created_before_time_before_quarantine = argument
        message.reply({content: `Set Anti-Nuke Settings Roles Created Before Time Set To \`${argument}\``})
      }
      else if(action == "quarantine_on_dangerous_permissions_added"){
        let argument = args[1]
        if(!args[1]) return message.reply({content: "Argument Missing: `true, false`"})
        argument = argument.toLowerCase()
        
        if(!["true", "false"].includes(argument)) return message.reply({content: "Argument Invalid: `true, false`"})
        let d = {
          "true": true,
          "false": false
        }
        
        if(obj.quarantine_on_dangerous_permissions_added == d[argument]) return message.reply({content: `Quaratine On Dangerous Permissions Added To Role Is Already Set To \`${argument}\``})
        
        obj.quarantine_on_dangerous_permissions_added = d[argument]
        message.reply({content: `Quaratine On Dangerous Permissions Added To Role Set To \`${argument}\``})
      }
      else if(action == "members_kicked_before_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 30 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 30 and greater than or equal to 1`"
          })
        }
        obj.members_kicked_before_time_before_quarantine = argument
        message.reply({content: `Set Anti-Nuke Settings Members Kick Before Time Set To \`${argument}\``})
      }
      else if(action == "members_banned_before_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 30 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 30 and greater than or equal to 1`"
          })
        }
        obj.members_banned_before_time_before_quarantine = argument
        message.reply({content: `Set Anti-Nuke Settings Members Banned Before Time Set To \`${argument}\``})
      }
      else if(action == "members_kicked_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.members_kicked_time = argument
        message.reply({content: `Set Anti-Nuke Settings Members Kicked Time Set To \`${argument}\``})
      }
      else if(action == "members_banned_time") {
        let argument = parseInt(args[1])
        if (!args[1]) return message.reply({
          content: "Argument Missing: `number`"
        })
        if (isNaN(argument)) return message.reply({
          content: "Argument Invalid: `number: must be an integer`"
        })
        if (argument > 60 || argument < 1) {
          return message.reply({
            content: "Argument Invalid: `number: must be less or equal to 60 and greater than or equal to 1`"
          })
        }
        obj.members_banned_time = argument
        message.reply({content: `Set Anti-Nuke Settings Members Banned Time Set To \`${argument}\``})
      }
      
      data.antinukesettings = obj
      data.save()
    }

  },
}
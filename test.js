const {
  Discord,
  MessageEmbed
} = require("discord.js");
const db = require("../../Models/Guild");
let functions = require("../../functions")
module.exports = {
  name: "roleall",
  aliases: [],
  permission: ["MANAGE_ROLES", "ADMINISTRATOR"],
  category: "moderation",
  req_perms: ["MANAGE_ROLES", "ADMINISTRATOR"],
  usage: ["$roleall <add/remove> <role> <optional: argument: bots,humans>"],
  description: "add/remove a role to/from everyone",
  run: async (client, message, args) => {


    if (!args[0]) return message.reply({
      content: `Must specify an action: \`add, remove\``
    })
    let action = args[0].toLowerCase()

    if (action == "add") {

      let role_arg = args[1]
      if (!role_arg) return message.reply({
        content: "Argument Missing: @role"
      })

      let argument = args[2]
      let filtered = false
      if (!argument || !["bots", "humans"].includes(argument.toLowerCase())) {
        args.shift()
        role_arg = args.join(" ")
      }


      if (argument && ["bots", "humans"].includes(argument.toLowerCase())) {
        filtered = true
      }

      let role = message.mentions.roles.first() || message.guild.roles.cache.get(role_arg) || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(role_arg))

      if (!role) return message.reply({
        content: "Argument Invalid: @role"
      })
      let count = 0
      if (filtered == true) {
        if (argument.toLowerCase() == "humans") {
          let humans = message.guild.members.cache.filter(m => !m.user.bot && m.roles.cache.get(role.id))
          message.reply({
            content: `Adding \`${role.name}\` From All Humans...Please Wait This Might Take a While Depending On How Much Humans There Are`
          })
          if (humans.size == 0) {
            return message.reply({
              content: `Successfully Added \`${role.name}\` To \`${humans.size-failed.length}\` Humans, Failed To Add \`${role.name}\` To \`${failed.length}\` Humans`
            })
          }
          let count = 0
          let failed = []
          humans.forEach(human => {
            human.roles.add(role).then(() => {
              count++
              if (count == humans.size) {
                return message.reply({
                  content: `Successfully Added \`${role.name}\` To \`${humans.size-failed.length}\` Humans, Failed To Add \`${role.name}\` To \`${failed.length}\` Humans`
                })
              }
            }).catch(err => {
              count++
              failed.push(human.id)
              if (count == humans.size) {
                return message.reply({
                  content: `Successfully Added \`${role.name}\` To \`${humans.size-failed.length}\` Humans, Failed To Add \`${role.name}\` To \`${failed.length}\` Humans`
                })
              }
            })
          })
        } else if (argument.toLowerCase() == "bots") {
          let bots = message.guild.members.cache.filter(m => m.user.bot && !m.roles.cache.get(role.id))
          let failed = []
          message.reply({
            content: `Adding \`${role.name}\` To All Bots...Please Wait This Might Take a While Depending On How Much Bots There Are`
          })

          if (bots.size == 0) {
            return message.reply({
              content: `Successfully Added \`${role.name}\` To \`${parseInt(bots.size)-parseInt(failed.length)}\` Bots, Failed To Add \`${role.name}\` To \`${failed.length}\` Bots`
            })
          }
          bots.forEach(bot => {
            bot.roles.add(role).then(() => {
              count++
              if (count == bots.size) {
                return message.reply({
                  content: `Successfully Added \`${role.name}\` To \`${parseInt(bots.size)-parseInt(failed.length)}\` Bots, Failed To Add \`${role.name}\` To \`${failed.length}\` Bots`
                })
              }
            }).catch(err => {
              count++
              failed.push(bot.id)
              if (count == bots.size) {
                return message.reply({
                  content: `Successfully Added \`${role.name}\` To \`${parseInt(bots.size)-parseInt(failed.length)}\` Bots, Failed To Add \`${role.name}\` To \`${failed.length}\` Bots`
                })
              }
            })
          })


        }
      } else {
        let members = message.guild.members.cache.filter(m => !m.roles.cache.get(role.id))
        message.reply({
          content: `Adding \`${role.name}\` To All Members...Please Wait This Might Take a While Depending On How Much Members There Are`
        })
        if (members.size == 0) {
          return message.reply({
            content: `Successfully Added \`${role.name}\` To \`${members.size-failed.length}\` Members, Failed To Add \`${role.name}\` To \`${failed.length}\` Members`
          })
        }
        let count = 0
        let failed = []
        members.forEach(member => {
          member.roles.add(role).then(() => {
            count++
            if (count == members.size) {
              return message.reply({
                content: `Successfully Added \`${role.name}\` To \`${members.size-failed.length}\` Members, Failed To Add \`${role.name}\` To \`${failed.length}\` Members`
              })
            }
          }).catch(err => {
            count++
            failed.push(member.id)
            if (count == members.size) {
              return message.reply({
                content: `Successfully Added \`${role.name}\` To \`${members.size-failed.length}\` Members, Failed To Add \`${role.name}\` To \`${failed.length}\` Members`
              })
            }
          })
        })
      }
    } else if (action == "remove") {
      let role_arg = args[1]
      if (!role_arg) return message.reply({
        content: "Argument Missing: @role"
      })
      let argument = args[2]
      let filtered = false
      if (!argument || !["bots", "humans"].includes(argument.toLowerCase())) {
        args.shift()
        role_arg = args.join(" ")
      }


      if (argument && ["bots", "humans"].includes(argument.toLowerCase())) {
        filtered = true
      }
      let role = message.mentions.roles.first() || message.guild.roles.cache.get(role_arg) || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(role_arg))

      if (!role) return message.reply({
        content: "Argument Invalid: @role"
      })
      let count = 0
      if (filtered) {
        if (argument.toLowerCase() == "humans") {
          let humans = message.guild.members.cache.filter(m => !m.user.bot && m.roles.cache.get(role.id))
          message.reply({
            content: `Removing \`${role.name}\` From All Humans...Please Wait This Might Take a While Depending On How Much Humans There Are`
          })
          if (humans.size == 0) {
            return message.reply({
              content: `Successfully Removed \`${role.name}\` From \`${humans.size-failed.length}\` Humans, Failed To Remove \`${role.name}\` From \`${failed.length}\` Humans`
            })
          }
          let count = 0
          let failed = []
          humans.forEach(human => {
            human.roles.remove(role).then(() => {
              count++
              if (count == humans.size) {
                return message.reply({
                  content: `Successfully Removed \`${role.name}\` From \`${humans.size-failed.length}\` Humans, Failed To Remove \`${role.name}\` From \`${failed.length}\` Humans`
                })
              }
            }).catch(err => {
              count++
              failed.push(human.id)
              if (count == humans.size) {
                return message.reply({
                  content: `Successfully Removed \`${role.name}\` From \`${humans.size-failed.length}\` Humans, Failed To Remove \`${role.name}\` From \`${failed.length}\` Humans`
                })
              }
            })
          })
        } else if (argument.toLowerCase() == "bots") {
          let bots = message.guild.members.cache.filter(m => m.user.bot && m.roles.cache.get(role.id))
          message.reply({
            content: `Removing \`${role.name}\` From All Bots...Please Wait This Might Take a While Depending On How Much Bots There Are`
          })
          if (bots.size == 0) {
            return message.reply({
              content: `Successfully Removed \`${role.name}\` From \`${bots.size-failed.length}\` Bots, Failed To Remove \`${role.name}\` From \`${failed.length}\` Bots`
            })
          }
          let count = 0
          let failed = []
          bots.forEach(bot => {
            bot.roles.remove(role).then(() => {
              count++
              if (count == bots.size) {
                return message.reply({
                  content: `Successfully Removed \`${role.name}\` From \`${bots.size-failed.length}\` Bots, Failed To Remove \`${role.name}\` From \`${failed.length}\` Bots`
                })
              }
            }).catch(err => {
              count++
              failed.push(bot.id)
              if (count == bots.size) {
                return message.reply({
                  content: `Successfully Removed \`${role.name}\` From \`${bots.size-failed.length}\` Bots, Failed To Remove \`${role.name}\` From \`${failed.length}\` Bots`
                })
              }
            })
          })


        }
      } else {
        let members = message.guild.members.cache.filter(m => m.roles.cache.get(role.id))
        message.reply({
          content: `Removing \`${role.name}\` From All Members...Please Wait This Might Take a While Depending On How Much Members There Are`
        })
        if (members.size == 0) {
          return message.reply({
            content: `Successfully Removed \`${role.name}\` From \`${members.size-failed.length}\` Members, Failed To Remove \`${role.name}\` From \`${failed.length}\` Members`
          })
        }
        let count = 0
        let failed = []
        members.forEach(member => {
          member.roles.remove(role).then(() => {
            count++
            if (count == members.size) {
              return message.reply({
                content: `Successfully Removed \`${role.name}\` From \`${members.size-failed.length}\` Members, Failed To Remove \`${role.name}\` From \`${failed.length}\` Members`
              })
            }
          }).catch(err => {
            count++
            failed.push(member.id)
            if (count == members.size) {
              return message.reply({
                content: `Successfully Removed \`${role.name}\` From \`${members.size-failed.length}\` Members, Failed To Remove \`${role.name}\` From \`${failed.length}\` Members`
              })
            }
          })
        })
      }
    }
  },
}
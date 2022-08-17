const {
  Discord,
  MessageEmbed
} = require("discord.js");
module.exports = {
  name: "createrole",
  aliases: [],
  permission: ["MANAGE_ROLES"],
  category: "moderation",
  req_perms: ["MANAGE_ROLES", "SEND_MESSAGES"],
  usage: ["$createrole <name>"],
  description: "create a role",
  run: async (client, message, args) => {
    let role_name = args.join(" ")
    
    if(!role_name) return message.reply({
      content: "Argument Missing: `role name`"
    })
    if(role_name.length > 32) return message.reply({
      content: "Argument Invalid: `role name: must be less than or equal to 32 characters`"
    })
    message.guild.roles.create({
         name: role_name,
         reason: `created by ${message.author.tag}`
     }).then(async() => {
         return message.reply({content: `Successfully created a role with the name \`${role_name}\``})
     }).catch(err => {
         return message.reply({content: `${err}`})
     })
    
  },
}

const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "whitelistedrole",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "SERVER_TRUSTED"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$whitelistedrole"],
  description: "see whitelisted role",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      let role = message.guild.roles.cache.get(data.trustrole)
      if(!role){
        role = "Not Set"
      } else {
        role = role.name
      }
      return message.reply({content: `Whitelisted Role Not Set`})
    } else {
      
      let role = message.guild.roles.cache.get(data.whitelistrole)
      if(!role){
        role = "Not Set"
      } else {
        role = role.name
      }
      if(data.whitelistrole == null) return message.reply({content: `Whitelisted Role Not Set`})
      
      let embed = new MessageEmbed()
      .setTitle("Whitelisted Role")
      .setDescription(`\`${role}\``)
      message.channel.send({embeds: [embed]})
    }
  },
}

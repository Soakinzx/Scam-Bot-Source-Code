const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "trustedrole",
  aliases: [],
  category: "anti",
  permission: ["ADMINISTRATOR", "OWNER"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$trustedrole"],
  description: "see trusted role",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      return message.reply({content: `Trusted Role Not Set`})
    } else {
      if(data.trustrole == null) return message.reply({content: `Trusted Role Not Set`})
      let role = message.guild.roles.cache.get(data.trustrole)
      if(!role){
        role = "Unkown"
      }
      let embed = new MessageEmbed()
      .setTitle("Trusted Role")
      .setDescription(`\`${role.name}\``)
      message.channel.send({embeds: [embed]})
    }
  },
}

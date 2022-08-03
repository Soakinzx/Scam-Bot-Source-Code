const {
  MessageEmbed
} = require("discord.js");
const functions = require("../../functions.js")
const gdb = require("../../Models/Guild")

module.exports = {
  name: "blacklisted",
  aliases: [],
  category: "configuration",
  permission: ["ADMINISTRATOR"],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$blacklisted"],
  description: "see all blacklisted members",
  run: async (client, message, args) => {
    let gs = functions.cloneobj(client.guild_schema)
    gs._id = message.guild.id
    
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if(!data){
      return message.reply({content: `There are no current blacklisted members`})
    } else {
      if(data.auto_roles.length == 0) return message.reply({content: `There are no current blacklisted members`})
      let embed = new MessageEmbed()
      .setTitle("Blacklisted Members")
      .setDescription(data.blacklisted.map(id => {
        return `\`${message.guild.members.cache.get(id) || "Unknown"}\``
    }).join(", "))
      message.channel.send({embeds: [embed]})
    }
  },
}

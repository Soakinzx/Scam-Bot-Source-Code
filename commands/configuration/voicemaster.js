      let data = await db.findOne({_gid: message.guild.id, _uid: message.author.id})
      if(!data || !message.guild.channels.cache.get(data._cid)) return message.reply({content: "You do not have a personal vc"})
      let channel = message.guild.channels.cache.get(data._cid)
      channel.permissionOverwrites.edit(message.guild.roles.everyone,{ 'CONNECT': false }).catch(err => {
        message.reply({content: `${err}`})
      })
      return message.reply({content: `Personal vc \`${channel.name}\` is now locked 🔐`})
      
    } else if(["unlock"].includes(action)) {
      let data = await db.findOne({_gid: message.guild.id, _uid: message.author.id})
      if(!data || !message.guild.channels.cache.get(data._cid)) return message.reply({content: "You do not have a personal vc"})
      let channel = message.guild.channels.cache.get(data._cid)
      channel.permissionOverwrites.edit(message.guild.roles.everyone,{ 'CONNECT': true }).catch(err => {
        message.reply({content: `${err}`})
      })
      return message.reply({content: `Personal vc \`${channel.name}\` is now unlocked 🔓`})
    } else {
      return message.reply({content: `Argument Invalid: \`action: ${actions.join(", ")}\``})
    }




  },
}

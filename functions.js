let crypto = require("crypto")
let client = require("./index.js")
let gdb = require("./Models/Guild")
let udb = require("./Models/UserRoles")
async function getdb(db, search) {
  let data = await db.findOne(search)
  if (data) {
    return data
  } else {
    return false
  }

}

function cloneobj(obj) {
  if (typeof obj !== 'object') throw new TypeError("[CLONEOBJ FUNCTION] Must Be An Object")
  if (null == obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function sleep(ms) {
  var start = new Date().getTime(),
    expire = start + ms;
  while (new Date().getTime() < expire) {}
}

function disable_all_components(msg) {

  let components = msg.components
  for (let i = 0; i < components.length; i++) {
    for (let j = 0; j < components[i].components.length; j++) {
      components[i].components[j]["disabled"] = true

    }

  }

  return components
}

function edit_embed(embed, element, data) {
  if (typeof embed !== "object") throw new TypeError("[EDIT_EMBED FUNCTION] Must Be A Valid Embed")


  let elements = ["title", "description", "color", "image", "footer"]
  if (!elements.includes(element)) throw new TypeError("[EDIT_EMBED FUNCTION] Embed Element Invalid")

  if (element == "title") {
    embed.setTitle(data)
  } else if (element == "description") {
    embed.setDescription(data)
  } else if (element == "image") {
    embed.setImage(data)
  } else if (element == "footer") {
    embed.setFooter(data)
  }
  return embed
}
async function temp_message(msg, data, time) {
  ms = time * 100
  let message = await msg.channel.send(data)

  let interval = setInterval(function() {
    message.delete()
    clearInterval(interval)
  }, ms)
}



function encrypt(text) {
  var algorithm = 'aes256'
  var key = `${Math.floor(Math.random()*(10000-1000)+1000)}`
  var cipher = crypto.createCipher(algorithm, key);
  var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return {
    key: key,
    data: encrypted
  }
}

function decrypt(key, text) {
  /*
if (typeof decrypt(msg[0], msg[1]) == 'string') {
  message.reply({
    content: `Here is your decrypted data: \`${decrypt(msg[0], msg[1])}\``
  })
}
  */
  var algorithm = 'aes256'
  var decipher = crypto.createDecipher(algorithm, key);
  var decrypted;
  try {
    decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8')

  } catch (err) {
    if (`${err}`.includes("bad decrypt")) {
      return `Invalid key`
    } else if (`${err}`.includes("is invalid for data of length 31")) {
      return `Invalid encrypted data`
    }
  }
  return decrypted
}

function text_block(msg) {
  return `\`\`\`${msg}\`\`\``
}

async function reset(db, search) {
  let data = await getdb(db, search)
  if (!data) {
    return;
  } else {
    await db.findOneAndDelete(search)
  }
}

function getowner(guild) {
  return guild.members.cache.get(guild.ownerId)
}

function isValidUrl(urlString) {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

function sendlogs(guild, embed) {

  gdb.findOne({
    _id: guild.id
  }, async (err, data) => {
    if (err) return
    if (!data) return
    let channel = guild.channels.cache.get(data.logs_channel)
    channel.send({
      embeds: [embed]
    }).catch(err => {
      return
    })
  })
}

function sendbotlogs(guild, embed) {


  gdb.findOne({
    _id: guild.id
  }, async (err, data) => {
    if (!data) return
    let channel = guild.channels.cache.get(data.bot_logs_channel)
    if (!channel) return;
    channel.send({
      embeds: [embed]
    }).catch(err => {
      return
    })
  })
}

async function remove_dangerous_roles(member) {
  let dangerous_permissions = ["ADMINISTRATOR", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MEMBERS", "MODERATE_MEMBERS", "MANAGE_GUILD"]

  let data = await getdb(gdb, {
    _id: member.guild.id
  })
  let dangerous_roles = member.roles.cache.filter(r => r.permissions.toArray().some(p => dangerous_permissions.includes(p)) && r.id !== data.quarantinerole)

  dangerous_roles.forEach(role => {
    if (!role) return;
    let rolemembers = []
    role.members.filter(m => m.user.bot).forEach(bot => {
      rolemembers.push(bot)
    })
    if (rolemembers.length == 1 && role.name == rolemembers[0].user.username) {
      role.setPermissions([])
    }
    member.roles.remove(role).catch(err => {
      let i=0
    })
  })

}

async function remove_all_roles(member) {
  if (!member) return

  let data = await getdb(gdb, {
    _id: member.guild.id
  })
  member.roles.cache.forEach(role => {
    if (role.id !== data.quarantinerole) {
      member.roles.remove(role).catch(err => {
        let i=0
      })
    }
  })
}

function quarantine(member) {
  let guild = member.guild
  if (!guild) return false
  let test = true

  gdb.findOne({
    _id: guild.id
  }, async (err, data) => {
    
    if (!data){
      test = false
    }
    let quarantinerole = guild.roles.cache.get(data.quarantinerole)
    if (!quarantinerole) {
      test = false
    }
    member.roles.add(quarantinerole).catch(err => {
      let i =0
    })
    await remove_dangerous_roles(member)
    await remove_all_roles(member)

    if(member.roles.cache.has(quarantinerole)) {
      test = true
    }
  })
  return test
}

async function refresh_quarantine(guild) {

  let data = await getdb(gdb, {
    _id: guild.id
  })
  if (!data || data.quarantinerole == null) return
  let role = guild.roles.cache.get(data.quarantinerole)
  if (!role) return
  guild.channels.cache.forEach(chnl => {
    chnl.permissionOverwrites.edit(role, {
      'VIEW_CHANNEL': false,
      "SEND_MESSAGES": false,
      "MANAGE_CHANNELS": false
    }).catch(err => {
      return
    })
  })
}

async function clonerole(role) {
  let guild = role.guild
  if (!guild) return
  let roleperms = role.permissions.toArray()

  let clonedrole = await guild.roles.create({
    name: role.name,
    permissions: roleperms
  }).catch(err => {
    let i =0
  })
  let data = await getdb(gdb, {
    _id: guild.id
  })
  if (data) {
    if (data.quarantinerole == role.id) {
      data.quarantinerole = clonedrole.id
      data.save()
    }
  }
  clonedrole.setColor(role.hexColor).catch(err => {
    let i =0
  })
  clonedrole.setPosition(guild.me.roles.highest.position-1).catch(err => {
    let i =0
  })
  clonedrole.setHoist(role.hoist).catch(err => {
    let i =0
  })
  clonedrole.setMentionable(role.mentionable).catch(err => {
    let i =0
  })
  if (role.iconURL({
      dynamic: true
    }) !== null) {
    clonedrole.setIcon(role.iconURL({
      dynamic: true
    })).catch(err => {
      let i =0
    })
  }
  
  await refresh_quarantine(guild)

  
  return true
}

async function dont_save_roles(member){
  let data = await getdb(udb, {_uid: member.id, _gid: member.guild.id})
  if(!data) return
  try {
    await udb.findOneAndDelete({_uid: id, _gid: member.guild.id}).catch(err => {
      return;
    })
  } catch {
    return;
  }
}

module.exports = {
  cloneobj: cloneobj,
  getdb: getdb,
  sleep: sleep,
  disable_all_components: disable_all_components,
  edit_embed: edit_embed,
  temp_message: temp_message,
  encrypt: encrypt,
  decrypt: decrypt,
  text_block: text_block,
  reset: reset,
  getowner: getowner,
  isValidUrl: isValidUrl,
  sendbotlogs: sendbotlogs,
  sendlogs: sendlogs,
  quarantine: quarantine,
  remove_dangerous_roles: remove_dangerous_roles,
  remove_all_roles: remove_all_roles,
  refresh_quarantine: refresh_quarantine,
  clonerole: clonerole,
  dont_save_roles: dont_save_roles
}
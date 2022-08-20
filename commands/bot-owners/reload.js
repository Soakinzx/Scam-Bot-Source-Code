const discord = require("discord.js")


module.exports = {
  name: "reload",
  description: "reload a command",
  category: "bot-owners",
  aliases: ["r"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$reload <command name/alias>"],
  run: async (client, message, args)=>{
    if(!client.owners.includes(message.author.id)) return;
    let cmdName = args[0]
    if(!cmdName) return message.reply({content: "Must specify a command name"})
    cmdName = cmdName.toLowerCase()
    const command = client.commands.get(cmdName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName))
    
    try{
      
      delete require.cache[require.resolve(`../../commands/${command.category}/${command.name}.js`)];

      client.commands.delete(command)

      const pull = require(`../../commands/${command.category}/${command.name}.js`)
      client.commands.set(command.name, pull)
      message.reply({content: `**Reloaded** ${command.name}`})
      
    } catch(err) {
      message.reply({content: `Cannot refresh cmds: ${err}`})
    }
  }
}

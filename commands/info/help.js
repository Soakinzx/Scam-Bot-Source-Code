const Discord = require("discord.js")
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require("discord.js");


module.exports = {
  name: "help",
  category: "info",
  aliases: ["h"],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$help"],
  description: "see all commands",
  run: async (client, message, args) => {
    let cmd = args[0]
    let prefix;
    let gdb = require("../../Models/Guild")
    let functions = require("../../functions.js")
    let data = await functions.getdb(gdb, {
      _id: message.guild.id
    })
    if (!data || data.prefix == null) {
      prefix = "$"
    } else {
      prefix = data.prefix
    }
    if (cmd) {
      const command = client.commands.get(cmd) || client.commands.find((cmd_) => cmd_.aliases && cmd_.aliases.includes(cmd))
      if (!command) return message.reply({
        content: "Please specify an existing command"
      })
      let usages = command.usage.map(usage => usage.replace("$", prefix))
      let embed = new MessageEmbed()
        .setTitle(`${command.name} info`)
        .setColor("DARK_BUT_NOT_BLACK")
        .addField("Description", `\`\`\`${command.description}\`\`\``, true)
        .addField("Category", `\`\`\`${command.category}\`\`\``, true)
        .addField("Aliases", `\`\`\`${command.aliases.join(" | ") || "None"}\`\`\``, true)
        .addField("Permissions Required", `\`\`\`${command.permission.join(" | ") || "None"}\`\`\``, true)
        .addField("Bot Permissions Required", `\`\`\`${command.req_perms.join(" | ") || "None"}\`\`\``, true)
        .addField("Usage", `\`\`\`${usages.join("\n")}\`\`\``, true)
        .setColor("DARK_BUT_NOT_BLACK")
      return message.reply({
        embeds: [embed]
      })
    } else {
      const directories = [...new Set(client.commands.map(cmd => cmd.category))]
      const formateStr = (str) => `${str[0].toUpperCase()}${str.substr(1)}`

      const categories = directories.map(dir => {
        const getCmds = client.commands.filter(cmd => cmd.category == dir).map(cmd => {
          return {
            name: cmd.name || "No name",
          }
        })
        return {
          directory: formateStr(dir),
          commands: getCmds
        }
      })

      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("list of command options")
        .addOptions(
          categories.map(cmd => {
            return {
              label: cmd.directory + `(${cmd.commands.length})`,
              value: cmd.directory.toLowerCase(),
              description: `displays ${cmd.directory.toLowerCase()} commands`
            }
          })
        )
        
      );
      

      function firstpage() {
        const category = categories[Math.floor(Math.random()*categories.length)]
        const category_embed = new MessageEmbed()
          .setTitle(`${category.directory}(${category.commands.length}) Commands`)
          .setColor("DARK_BUT_NOT_BLACK")
          .setFooter(`${prefix}help <cmdname> for more information on a command`)
          .setDescription(category.commands.map(cmd => `\`${cmd.name}\``).join(", "))
        return category_embed
      }
      let embed = firstpage()

      const sendmsg = await message.reply({
        embeds: [embed],
        components: [row],
      });

      try {
        const filter = (interaction) => {
          return interaction.user.id === message.author.id
        }
        const collector = await sendmsg.createMessageComponentCollector({
          filter,
          componentType: "SELECT_MENU",
          time: 60000,
        });

        collector.on("collect", async (interaction) => {
          const [directory] = interaction.values;
          const category = categories.find(x => x.directory.toLowerCase() == directory)
          const category_embed = new MessageEmbed()
            .setTitle(`${category.directory}(${category.commands.length}) Commands`)
            .setColor("DARK_BUT_NOT_BLACK")
            .setFooter(`${prefix}help <cmdname> for more information on a command`)
            .setDescription(category.commands.map(cmd => `\`${cmd.name}\``).join(", "))
          interaction.component.setPlaceholder(`${category.directory}`)
          interaction.update({
            embeds: [category_embed],
            components: sendmsg.components
          })


        });
        collector.on("end", async () => {
          
          sendmsg.edit({components: functions.disable_all_components(sendmsg)}).catch(err => {
              return;
          })
        });
      } catch {}
    }
  },
};
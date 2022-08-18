const discord = require("discord.js")
let functions = require("../../functions.js")
function getdays(month, day) {
    let today = new Date();
    var date = new Date(today.getFullYear(), month, day);
    if(today.getMonth() >= month && today.getDate() > day) {
      date.setFullYear(date.getFullYear() + 1);
    }
    var one_day = 1000 * 60 * 60 * 24;
    return  `${Math.ceil((date.getTime() - today.getTime()) / one_day)+1}`
}
module.exports = {
  name: "birthday",
  aliases: ["bday"],
  category: "fun",
  permission: [],
  usage: ["$birthday <set/status>"],
  req_perms: ["SEND_MESSAGES"],
  description: "birthday command",
  run: async (client, message, args) => {
    if(!args[0]) return message.reply({
      content: "Argument Missing: `action: supported actions: set, status`"
    })
    let action = args[0].toLowerCase()
    const monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December',
      ];
    if(action == "set") {
      const month = parseInt(args[1]) - 1;
      const day = parseInt(args[2]);

      if(!month) {
        return message.reply({
          content: 'Argument Missing: `month number: must be an integer`'
        });
      }
      if(month < 0 || month > 11) {
        return message.reply({
          content: 'Argument Invalid: `month number: must be a number from 1-12`'
        });
      }
      if(!day) {
        return message.reply({
          content: 'Argument Missing: `day number: must be an integer`'
        });
      }
      if(day < 1 || day > 31) {
        return message.reply({
          content: 'Argument Invalid: `day number: must be a number from 1-31`'
        });
      }
      let us = functions.cloneobj(client.user_schema)

      if(!client.userdb.get(message.author.id)) {
          us.birthday.month = month
          us.birthday.day = day
          client.userdb.set(message.author.id, us)
      } else {
          client.userdb.set(message.author.id, month, "birthday.month")
          client.userdb.set(message.author.id, day, "birthday.day")
      }
      let data = client.userdb.get(message.author.id)
      return message.reply({content: `Birthday set to **${monthNames[data.birthday.month]} ${data.birthday.day}**`})
      
    } else if(["now", "status"].includes(action)) {
        let data = client.userdb.get(message.author.id)
        if(!data || !data.birthday.month || !data.birthday.day) return message.reply({content: "Birthday not set"})
        let daysleft = getdays(data.birthday.month, data.birthday.day)
        let embed = {
            title: "Birthday Status",
            description: `**${monthNames[data.birthday.month]} ${data.birthday.day}(**\`${daysleft} days left\`**)**`
        }
        return message.reply({embeds: [embed]})
    } else {
        return message.reply({content: "Argument Invalid: `action: supported actions: set, status`"})
    }
  }
}

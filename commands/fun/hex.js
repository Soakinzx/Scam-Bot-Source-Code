const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
module.exports = {
  name: 'hex',
  description: 'Show hex color',
  usage: ["$hex <hexcode>"],
  category: 'fun',
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  aliases: ["hexcode","hexcolor"],
  run: async (client,message,args)=> {
    let hex;
    hex = args[0]
    if (!hex) return message.reply('Argument Missing: `hexcode`');
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (regex.test(hex)) {
      const color = hex.replace('#', '');
      const response = await fetch(`https://api.alexflipnote.dev/colour/${color}`);
      await response.json().then(res => {
        message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`Color 〢 ${res.name}`)
              .setURL(`https://www.color-hex.com/color/${color}`)
              .setThumbnail(res.image)
              .setImage(res.image_gradient)
              .setColor(res.hex)
              .addField('Hex', `${res.hex}`, true)
              .addField('RGB', `${res.rgb}`, true)
          ]
        });
      });
    } else {
      message.reply('Argument Invalid: `hexcode: must be a valid hexcode`');
    }
  }
};

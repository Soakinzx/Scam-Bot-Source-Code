const fetch = require('node-fetch')

const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "ip",
    aliases: [],
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    category: "fun",
    description: "get info about an ip",
    usage: ["$ip <IPV4>"],
    run: async (client, message, args) => {
      if (!args.length) {return await message.reply({ content: 'Argument Missing: `IPV4`' });}
		const data = await fetch(`https://ipinfo.io/${args[0]}/geo`)
			.then((res) => res.json());
      
		if (data.error) {
			return await message.reply({ content: data.error.message });
		}
		const ip = data.ip;
		const embed = new MessageEmbed()
			.setColor("DARK_BUT_NOT_BLACK")
			.setTitle(`IP info for \`${ip}\``)
			.addField('IP:', ip);

		if (data.bogon) {
			embed.addField('Bogon', 'true');
		} else {
			const city = data.city;
			const region = data.region;
			const country = data.country;
			const location = data.loc;
			const postal = data.postal;
			const timezone = data.timezone;
			const user = message.author;

			embed
				.addField('City:', city)
				.addField('Region:', region)
				.addField('Country:', country)
				.addField('Location:', location)
				.addField('Postal code:', postal)
				.addField('Timezone:', timezone)
				.setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
				.setTimestamp();
		}
		await message.reply({ embeds: [embed] });
    },
};
const fetch = require('node-fetch').default;
const { MessageEmbed } = require('discord.js');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
module.exports = {
    name: "urban",
    aliases: [],
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    category: "fun",
    usage: ["$urban <text>"],
    description: "urban dictionary",
    run: async (client, message, args) => {
       if (!args.length) {
			return message.reply({content: "Argument Missing: `text`"});
		}
		const query = args.join(' ');
		const url = new URL('/v0/define', 'https://api.urbandictionary.com/');

		url.searchParams.set('term', query);
		const res = await fetch(url);

		if (!res.ok) {return await message.reply(`HTTP Error ${res.status}: ${res.statusText}`);}

		const { list } = await res.json();

		if (!list.length) {
			return await message.reply({ content: `No results found for **${args.join(' ')}**.` });
		}
		const [answer] = list;
		const embed = new MessageEmbed()
			.setColor("DARK_BUT_NOT_BLACK")
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{
					name: 'Rating',
					value: `👍 ${answer.thumbs_up} thumbs up. 👎 ${answer.thumbs_down} thumbs down.`,
				},
			);

		await message.reply({ embeds: [embed] });
    },
}
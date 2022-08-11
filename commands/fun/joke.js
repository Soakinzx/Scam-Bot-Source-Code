const Discord = require("discord.js");
const { spoiler } = require('@discordjs/builders');
const fetch = require('node-fetch')

const baseURL = 'https://blague.xyz/';
async function getJoke(path) {
	const url = new URL(`/api/joke/${path}`, baseURL);

	url.searchParams.set('lang', 'EN');
	const res = await fetch(url);

	if (!res.ok) {throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);}

	const obj = await res.json();

	if (obj.error) {
		throw new Error('The returned object has an error');
	}

	return obj.joke;
}
function getRandomJoke() {
	return getJoke('random');
}

module.exports = {
    name: "joke",
    aliases: [],
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    category: "fun",
    description: "sends a funny joke",
    usage: ["$joke"],
    run: async (client, message, args) => {
      const joke = await getRandomJoke();
			const embed = new Discord.MessageEmbed()
				.setTitle(`${joke.question}`)
				.setColor("DARK_BUT_NOT_BLACK")
				.setDescription(`${spoiler(joke.answer)}`)
				.setTimestamp();

			return await message.reply({ embeds: [embed] });
    },
};
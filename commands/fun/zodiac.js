const Discord = require("discord.js");
const bounds = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
const signs = [
	'Capricorn', 'Aquarius', 'Pisces',
	'Aries', 'Taurus', 'Gemini',
	'Cancer', 'Leo', 'Virgo',
	'Libra', 'Scorpio', 'Sagittarius',
];
const monthNames = [
	'January', 'February', 'March',
	'April', 'May', 'June',
	'July', 'August', 'September',
	'October', 'November', 'December',
];
module.exports = {
    name: "zodiac",
    aliases: [],
    permission: [],
    req_perms: ["SEND_MESSAGES"],
    category: "fun",
    description: "get to know your zodiac sign",
    usage: ["$zodiac <month> <day>"],
    run: async (client, message, args) => {
      const month = parseInt(args[0]) - 1;
		const day = parseInt(args[1]);

		if (!month) {
			return message.reply({content: 'Specify a month number'});
		}
		if (month < 0 || month > 11) {
			return message.reply({content: 'That is not a valid month number: 1-12'});
		}
		if (!day) {
			return message.reply({content: 'Specify a day number'});
		}
		if (day < 1 || day > 31) {
			return message.reply({content: 'That is not a valid day number: 1-31'});
		}
		const signIndex = (month + +(day > bounds[month])) % monthNames.length;
		const sign = signs[signIndex];

		await message.reply({content: `Your zodiac sign is ${sign}`});
    },
};
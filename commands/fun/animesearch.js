const { MessageEmbed } = require('discord.js');
const Anilist = require('anilist-node');
const anilist = new Anilist();

module.exports = {
  name: 'animesearch',
  description: 'Displays information about specified anime.',
  usage: ["$animesearch <name>"],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  aliases: ["as"],
  permission: [],
  run: async (client, message, args)=> {
    const anime_name = args.join(" ")
    if (anime_name == undefined) return message.reply('Provide Anime Name.');

    const search = await anilist.search('anime', anime_name);
    if (typeof search.media[0] == 'undefined') return message.reply(`Couldn't find an anime with name ${anime}`);
    const anime = await anilist.media.anime(search.media[0].id);
    
    let animeDescription = anime.description.replace(/<[^>]*>?/gm, '');
    if (animeDescription.length > 1024)
      animeDescription = `${anime.description.replace(/<[^>]*>?/gm, '').substring(0, 1020)}...`;
    
    message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(anime.title.english || anime.title.native || anime.title.romaji)
            .setURL(anime.siteUrl)
            .setImage(`https://img.anili.st/media/${anime.id}`)
            .setThumbnail(anime.coverImage.large)
            .addField('Romaji Name', `${anime.title.romaji}`, true)
            .addField('English Name', `${anime.title.english}`, true)
            .addField('Native Name', `${anime.title.native}`, true)
            .addField('Country of Origin', `${anime.countryOfOrigin}`, true)
            .addField('Total Episodes', `${anime.episodes}`, true)
            .addField('Episodes Duration', `${anime.duration}`, true)
            .addField('Contains Adult Content', `${anime.isAdult ? 'Yes' : 'No'}`, true)
        ]
      });
  }
};
const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "holiday",
  aliases: [],
  permission: [],
  req_perms: ["SEND_MESSAGES"],
  usage: ["$holiday <holiday>"],
  category: "fun",
  run: async (client, message, args) => {
    let months = [
      "january", "february", "march", "april", "may",
      "june", "july", "august", "september", "october", "novemeber", "december"
    ]
    let supported_holidays = {
      "christmas": {
        month: 12,
        day: 25,
        image: "https://i.natgeofe.com/k/dfc7bec2-0657-4887-81a7-6d024a8c3f70/WH-XmasTree.jpg"
      },
      "christmas eve": {
        month: 12,
        day: 24,
        image: "https://i.natgeofe.com/k/dfc7bec2-0657-4887-81a7-6d024a8c3f70/WH-XmasTree.jpg"
      },
      "halloween": {
        month: 10,
        day: 31,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNmZuthoZebFhrJBGKfW-pmjEsNUBFZN-QSQ&usqp=CAU"
      },
      "thanksgiving": {
        month: 11,
        day: 24,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6paKDqHutQ4as8S5DFLgT6v6_Xi9xve_ZCw&usqp=CAU"
      },
      "4th of july": {
        month: 7,
        day: 4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo_bTkx4HUn23Pa8nCCq6KtHZ7nd7wKpmQpQ&usqp=CAU"
      },
      "mothers day": {
        month: 5,
        day: 14,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHjYDqDJRTUnnsgieD9J-nawLaTddDP03iQw&usqp=CAU"
      },
      "fathers day": {
        month: 6,
        day: 18,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVJk3UNcqJ-HgsDKRTQnhPrCYujIUkIaFnmQ&usqp=CAU"
      },
      "new years": {
        month: 1,
        day: 1,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo_bTkx4HUn23Pa8nCCq6KtHZ7nd7wKpmQpQ&usqp=CAU"
      },
      "new years eve": {
        month: 12,
        day: 31,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo_bTkx4HUn23Pa8nCCq6KtHZ7nd7wKpmQpQ&usqp=CAU"
      },
      "easter": {
        month: 4,
        day: 9,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDRw9vGRvtAX17SGOf9MZ-jISye_ziHDnjRA&usqp=CAU"
      },
      "valentines day": {
        month: 2,
        day: 14,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUNlc6I1IW5bXHErm-AAj2XwFCRjHZAdU4w&usqp=CAU"
      },
      "saint patricks day": {
        month: 3,
        day: 17,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaT7jAEpzHxRVjv9rBNw9tcS2PpBHfS7tQ0g&usqp=CAU"
      },
      "hanukkah": {
        month: 12,
        day: 18,
        image: "https://learnenglish.britishcouncil.org/sites/podcasts/files/RS7768_ThinkstockPhotos-861945792_0.jpg"
      }
    }
    if(!args.length) return message.reply({
      content: "Argument Missing: `holiday`"
    })
    let holiday = args.join(" ")
      .toLowerCase()
    let holidays = Object.keys(supported_holidays)
    if(!holidays.includes(holiday)) return message.reply({
      content: `Argument Invalid: \`holiday: supported holidays: ${holidays.join("\n")}\``
    })
    let {
      month,
      day,
      image
    } = supported_holidays[holiday]
    month -= 1
    today = new Date();
    var hol = new Date(today.getFullYear(), month, day);
    if(today.getMonth() >= month && today.getDate() > day) {
      hol.setFullYear(hol.getFullYear() + 1);
    }
    var one_day = 1000 * 60 * 60 * 24;
    let randomImage =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNmZuthoZebFhrJBGKfW-pmjEsNUBFZN-QSQ&usqp=CAU";

    const holidayembed = new MessageEmbed()
      .setTitle(
        `${Math.ceil(
               (hol.getTime() - today.getTime()) / one_day
             )+1} days left until ${holiday}!`
      )
      .setDescription(`${months[month]} ${day}`)
      .setThumbnail(image)
      .setURL(`${image}`)
    
    message.channel.send({embeds: [holidayembed]})

  },
};

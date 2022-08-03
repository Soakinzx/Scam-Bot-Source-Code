module.exports = {
  name: "emojify",
  permission: [],
  aliases: ["emoji"],
  category: "fun",
  req_perms: ["SEND_MESSAGES"],
  usage: ["$emojify <message>"],
  description: "Make any sentence out of emoji's",

  run: async (client, message, args) => {
    let sentence = "";
    const em = args.join(" ") || "No_text_given_to_emojify";

    let chars = {
      char1: ":one:",
      char2: ":two:",
      char3: ":three:",
      char4: ":four:",
      char5: ":five:",
      char6: ":six:",
      char7: ":seven:",
      char8: ":eight:",
      char9: ":nine:",
      "char+": ":heavy_plus_sign:",
      "char-": ":heavy_minus_sign:",
      "char*": ":asterisk:",
      "char÷": ":heavy_division_sign:",
      "char#": ":hash:",
      "char!": `:exclamation:`,
    };
    let invis = "ㅤ"
    client.emojis.cache.get("982032952655495178")
    for (let e of em) {
      if (/([a-z])/gim.test(e))
        sentence += ` :regional_indicator_${e.toLowerCase()}:`;
      else if (/\s/.test(e)) sentence += ` ${invis}`;
      else if (/([1-9])/.test(e) || ["+", "-", "*", "#", "!", "÷"].includes(e))
        sentence += ` ${chars[`char${e}`]}`;
      else sentence += ` ${e}`;
    }

    message.channel.send(sentence);
  },
};
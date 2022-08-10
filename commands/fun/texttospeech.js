let {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior
} = require('@discordjs/voice');
let {
  Client,
  Message,
  MessageEmbed
} = require("discord.js");
let {
  getAudioUrl
} = require("google-tts-api");
let functions = require("../../functions.js")
module.exports = {
  name: "texttospeech",
  aliases: ["tts"],
  category: "fun",
  permission: [],
  usage: ["$texttospeech <text>"],
  req_perms: ["SEND_MESSAGES", "CONNECT", "SPEAK"],
  description: "convert text to speech",
  run: async (client, message, args) => {

    if (!args.join(" ")) return message.reply({
      content: "Argument Missing: `text`"
    })
    let text = args.join(" ")
    let voiceChannel = message.member.voice.channel;
    if (text.length > 500) return message.reply("Argument Invalid: `text: i can only speak 500 words`");
    if (!voiceChannel) return message.channel.send("Please join a voice channel first");

    let audioUrl = await getAudioUrl(text, {
            lang: "en",
            slow: false,
            host: 'https://translate.google.com',
            timeout: 5000,
        });
        message.react("<:check:1007053001720090694>")
        let player = createAudioPlayer();
        let resource = createAudioResource(audioUrl);

        let connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.channel.guild.id,
            adapterCreator: message.channel.guild.voiceAdapterCreator,
        });

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.disconnect();
        });

  }
}

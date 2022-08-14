const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} = require("discord.js");
const functions = require("../../functions.js")
module.exports = {
    name: "emojiguess",
    aliases: ["eg"],
    category: "fun",
    req_perms: ["SEND_MESSAGES"],
    permission: [],
    usage: ["$emojiguess <easy/hard>", "$emojiguess easy", "$emojiguess hard"],
    description: "guess the emoji",
    run: async (client, message, args, config) => {
        const mode = args[0]
        if (mode === "easy") {
            const eArray = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣"];
            const randEmoji = eArray[Math.floor(Math.random() * eArray.length)];
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("😆")
                .setEmoji("😆")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😅")
                .setEmoji("😅")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😂")
                .setEmoji("😂")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("🤣")
                .setEmoji("🤣")
                .setStyle("SUCCESS")
            );
            const row2 = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("😀")
                .setEmoji("😀")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😃")
                .setEmoji("😃")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😄")
                .setEmoji("😄")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😁")
                .setEmoji("😁")
                .setStyle("SUCCESS")
            );

            let msg = await message.channel.send({
                content: "Can you guess the emoji?",
                components: [row, row2]
            }).catch({});
            const response = [
                "WRONG!",
                "Maybe next time",
                "Try again smh"
            ];
            const responses = response[Math.floor(Math.random() * response.length)];
            const filter = (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                else return interaction
                    .reply({
                        content: "You cannot use this button",
                        ephemeral: true
                    })
                    .catch({});
            };
            const collector = msg.createMessageComponentCollector({
                filter,
                max: 1,
            });
            collector.on("end", async (ButtonInteraction) => {
                const id = ButtonInteraction.first().customId;
                const i = ButtonInteraction.first()
                if (id !== randEmoji) {
                    i.component.setStyle("DANGER")
                    i.update({
                            content: `**${responses}**`,
                            components: await functions.disable_all_components(msg),
                        })
                        .catch({});
                } else {
                    i.component.setStyle("primary")
                    i.update({
                            content: `**Good Job!**`,
                            components: await functions.disable_all_components(msg),
                        })
                        .catch({});
                }

            });
        } else if (mode === "hard") {
            const hArray = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪"];
            const randEmoji = hArray[Math.floor(Math.random() * hArray.length)];
          //console.log(randEmoji)
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("😆")
                .setEmoji("😆")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😅")
                .setEmoji("😅")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😂")
                .setEmoji("😂")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("🤣")
                .setEmoji("🤣")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😊")
                .setEmoji("😊")
                .setStyle("SUCCESS")
            );
            const row2 = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("😀")
                .setEmoji("😀")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😃")
                .setEmoji("😃")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😄")
                .setEmoji("😄")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😁")
                .setEmoji("😁")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😇")
                .setEmoji("😇")
                .setStyle("SUCCESS")
            );
            const row3 = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("🙂")
                .setEmoji("🙂")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("🙃")
                .setEmoji("🙃")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😉")
                .setEmoji("😉")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😌")
                .setEmoji("😌")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😍")
                .setEmoji("😍")
                .setStyle("SUCCESS")
            );
            const row4 = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("🥰")
                .setEmoji("🥰")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😘")
                .setEmoji("😘")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😗")
                .setEmoji("😗")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😙")
                .setEmoji("😙")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😚")
                .setEmoji("😚")
                .setStyle("SUCCESS")
            );
            const row5 = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("😋")
                .setEmoji("😋")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😛")
                .setEmoji("😛")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😝")
                .setEmoji("😝")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("😜")
                .setEmoji("😜")
                .setStyle("SUCCESS"),
                new MessageButton()
                .setCustomId("🤪")
                .setEmoji("🤪")
                .setStyle("SUCCESS")
            );

            let msg = await message.channel.send({
                content: "Can you guess the emoji?",
                components: [row, row2, row3, row4, row5]
            }).catch({});
            const response = [
                "I guess you cant do it",
                "Maybe next time",
                "Try again smh",
                "bad guesser lol",
            ];
            const responses = response[Math.floor(Math.random() * response.length)];
            const filter = (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                return interaction
                    .reply({
                        content: "You cannot use this button",
                        ephemeral: true
                    })
                    .catch({});
            };
            const collector = msg.createMessageComponentCollector({
                filter,
                max: 1,
            });
            collector.on("end", async (ButtonInteraction) => {
                const id = ButtonInteraction.first().customId;
                let i =ButtonInteraction.first()
                if (id !== randEmoji) {
                    let embed = new MessageEmbed()
                        .setTitle(" ")
                        .setDescription(`**${responses}**`)
                        .setColor("DARK_BUT_NOT_BLACK")
                    i.component.setStyle("DANGER")
                    i.update({
                            content: `**${responses}**`,
                            components: await functions.disable_all_components(msg),
                        })
                        .catch({});

                } else {
                    i.component.setStyle("PRIMARY")
                    i.update({
                            content: "**Good Job!**",
                            components: await functions.disable_all_components(msg),
                        })
                        .catch({});

                }
            });
        } else {
            message.channel.send({
                content: "Argument Invalid: `mode: supported modes: easy, hard`"
            })
        }

    },
}

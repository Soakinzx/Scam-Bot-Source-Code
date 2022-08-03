const Discord = require("discord.js")
const print = console.log
const db = require("../../Models/Guild");
module.exports = {
    name: "autorespond",
    aliases: ["ar"],
    category: "configuration",
    permission: ["ADMINISTRATOR"],
    req_perms: ["SEND_MESSAGES"],
    description: "makes an auto responder",
    usage: ["$autorespond <add/remove/viewall/removeall>", "$autorespond add <trigger>;<response>", "$autorespond remove <trigger>", "$autorespond removeall", "$autorespond viewall"],
    run: async (client, message, args) => {
        const operation = args[0]
      if(!operation) return message.reply({content: "Argument Missing: `add, remove, removeall, viewall`"})
      let functions = require("../../functions.js")
      let gs = functions.cloneobj(client.guild_schema)
      gs._id = message.guild.id
        if (operation.toLowerCase() == "add" || operation.toLowerCase() == "a" || operation.toLowerCase() == "ad") {
            args.shift()
            let m = args.join(" ").split(";")[0].split(" ")
            
            for(let i=0;i<m.length;i++){
              if(m[i] == "" || m[i] == " "){
                m.splice(i, 1)
              }
            }
            const message1 = m.join(" ").toLowerCase() //name
            if (!message1) {
                return message.channel.send({
                    content: "You must specify another a name ex. $ar add <trigger>;<response>"
                })
            }

            const message2 = args.join(" ").split(";")[1] || "No text specified" //output if name is called

            db.findOne({
                _id: message.guild.id
            }, async (err, data) => {
                if (err) throw err;
                
                if (!data) {
                  
                  gs.Autorespond_messages = [{
                            trigger: message1,
                            response: message2
                        }]
                    data = new db(gs)
                    message.channel.send({
                        content: "Auto reponse trigger & response set"
                    })
                } else {
                    for (const info of data.Autorespond_messages) {
                        if (info.trigger == message1) {
                            return message.channel.send({
                                content: "Auto reponse trigger already exist"
                            })
                        }
                    }
                    data.Autorespond_messages.push({
                        trigger: message1,
                        response: message2
                    })
                    message.channel.send({
                        content: "Auto reponse trigger & response set"
                    })
                }
                data.save()
            })
        } else if (operation.toLowerCase() == "r" || operation.toLowerCase() == "remove" || operation.toLowerCase() == "delete" || operation.toLowerCase() == "del") {
            args.shift()
            const message1 = args.join(" ").toLowerCase()

            db.findOne({
                _id: message.guild.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new db(gs)
                    message.channel.send({
                        content: "Data of guild not found, created new data, please try this command again"
                    })
                } else {
                    if (data.Autorespond_messages.length >= 1) {
                        for (let i = 0; i < data.Autorespond_messages.length; i++) {
                            if (data.Autorespond_messages[i].trigger == message1) {
                                console.log(data.Autorespond_messages[i].trigger + " : " + message1)
                                data.Autorespond_messages.splice(i)
                                data.save()
                                return message.channel.send({
                                    content: "Auto response trigger & response removed"
                                })
                            }
                        }
                        message.channel.send({
                            content: "Auto response trigger does not exist"
                        })


                    } else {
                        return message.channel.send({
                            content: "No triggers exist"
                        })
                    }
                }
                data.save()
            })
        } else if (operation.toLowerCase() == "showall" || operation.toLowerCase() == "view" || operation.toLowerCase() == "viewall" || operation.toLowerCase() == "list") {
            db.findOne({
                _id: message.guild.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new db(gs)
                    message.channel.send({
                        content: "Data of guild not found, created new data, please try this command again"
                    })
                } else {
                    if (data.Autorespond_messages.length >= 1) {
                        let embed = new Discord.MessageEmbed()
                        embed.setTitle("Auto Respond Triggers & Responses")
                        embed.setDescription(`${data.Autorespond_messages.map((info, i) => `\n**${info.trigger} :** ${info.response}`)}`)
                        embed.setColor("DARK_BUT_NOT_BLACK")
                        return message.channel.send({
                            embeds: [embed]
                        })
                    } else {
                        return message.channel.send({
                            content: "No triggers exist"
                        })
                    }
                }
            })

        } else if (operation.toLowerCase() == "removeall" || operation.toLowerCase() == "ra") {
            db.findOne({
                _id: message.guild.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new db(gs)
                    message.channel.send({
                        content: "Data of guild not found, created new data, please try this command again"
                    })
                } else {
                    if (data.Autorespond_messages.length >= 1) {
                        data.Autorespond_messages = []
                        data.save()
                        return message.channel.send({
                            content: "All triggers & responses have been removed"
                        })
                    } else {
                        return message.channel.send({
                            content: "No triggers exist"
                        })
                    }
                }
                data.save()
            })
        }


    },
}
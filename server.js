const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs-extra");
const client = new Discord.Client();
const hypixel = require("hypixel-api")
const parser = require("discord-command-parser")
const axios = require("axios")
const hyClient = new hypixel("a790f417-f352-461b-9b53-72931a796675")
const prefix = "s-"
client.on('ready', () => {
    console.log(`Ready! ${client.user.tag}`);
    client.channels.cache.get("722173404995780708").send("jdjdasj")
    client.user.setPresence({
        activity: {
            name: "Skillfully Guild"
        },
        status: "idle",
        type: "WATCHING"
    })
});

client.on('message', (message) => {
    console.log(message)
    if(message.author.bot==true) return
    if(message.content==`${prefix}j`) {
        const args = message.content.split(" ").slice(1)
        const username = args[0]
        const gamemode = args[1]
        message.channel.send("j")
    }
    if(message.author.id=="402639792552017920"&&message.content=="test") {
        message.reply("test");
    }
    
});
client.login("");
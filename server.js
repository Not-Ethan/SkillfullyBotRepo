const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs-extra");
const token = process.env.TOKEN;
const client = new Discord.Client();
const hypixel = require("hypixel-api")
const parser = require("discord-command-parser")
const axios = require("axios")
const hyClient = new hypixel("a790f417-f352-461b-9b53-72931a796675")
const prefix = "s-"
console.log(token)
client.on('ready', () => {
    console.log("Ready!")
    client.user.setPresence({
        activity: {
            name: "Skillfully Guild"
        },
        status: "idle",
        type: "LISTENING"
    })
});

client.on('message', message => {
    if(!message.content.startsWith(prefix)) return
    if(message.author.bot==true) return

}); 
client.login(token);
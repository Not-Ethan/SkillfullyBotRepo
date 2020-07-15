const Discord = require("discord.js");
const Enmap = require("enmap");
const events = require("events")
const fs = require("fs-extra");
const client = new Discord.Client();
const hypixel = require("hypixel-api")
const parser = require("discord-command-parser")
const axios = require("axios")
const token = process.env.TOKEN;
const hyClient = new hypixel(process.env.key)
const prefix = "s-"
function capitalize(s) {
    if(typeof s != "string") return
    return s.charAt(0).toUpperCase + s.slice(1);
}
function formatNumber(x) {
    return x.toLocaleString()
    //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const emitter = new events.EventEmitter()
client.on('ready', () => {
    console.log(`Ready! ${client.user.tag}`);
    client.user.setPresence({
        activity: {
            name: "Skillfully Guild"
        },
        status: "idle",
        type: "WATCHING"
    })
});
client.on('message', (message) => {
    const gamemodes = {
        bw: "Bedwars",
        sw: "Skywars",
        sb: "Skyblock"
    }
    const gamemodes2 = ["Bedwars", "Skywars", "Skyblock"]
    if(message.author.bot==true) return
    if(message.content.startsWith(`${prefix}stats`)) {
        const args = message.content.split(" ").slice(1)
        const username = args[0]
        let gamemode = args[1]
        if(!gamemode) return message.channel.send(`You need to specify a gamemode ${message.author}.`)
        if(!gamemodes.hasOwnProperty(gamemode.toLowerCase())&&!gamemodes2.includes(capitalize(gamemode))) return message.channel.send(`Please choose a proper gamemode, ${message.author}.`)
        if(gamemodes.hasOwnProperty(gamemode.toLowerCase())) {
        gamemode = gamemodes[gamemode.toLowerCase()]
        }
        let embed;
        hyClient.getPlayer("name", username).then(player=>{
            let base;
            embed = new Discord.MessageEmbed()
            .setColor("#6119a8")
            .setFooter("© 2020 skillfully guild", "https://i.ibb.co/GMmBzLY/blue-and-purp.png")
            .setThumbnail("https://i.ibb.co/GMmBzLY/blue-and-purp.png")
            .setTitle(`Stats for ${username} in \`${gamemode}\``)
            .setTimestamp()
            if(gamemode == "Bedwars") {
                base = player.player.stats["Bedwars"]
                embed
                .addField("Level/Stars:", player.player.achievements.bedwars_level)
                .addField("Final Kills",  base["final_kills_bedwars"], true)
                .addField("Final Deaths",  base["final_deaths_bedwars"], true)
                .addField("FKDR", Math.round(1000*(base.final_kills_bedwars/base.final_deaths_bedwars))/1000, true)
                .addField("\u200b", "\u200b")
                .addField("Beds Broken", base.beds_broken_bedwars, true)
                .addField("BBLR", Math.round(1000*(base.beds_broken_bedwars/base.losses_bedwars))/1000, true)
                .addFields({name: "WLR", value: Math.round(1000*(base.wins_bedwars/base.losses_bedwars))/1000, inline: true})
                .setAuthor(message.guild.me.displayName, message.guild.me.user.avatarURL(), null)
                return embed
        } else if(gamemode == "Skywars") {
                function sw_xp_to_lvl(xp) {
                let xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
                if(xp >= 15000) {
                    return (xp - 15000) / 10000 + 12;
                } else {
                    for(let i = 0; i < xps.length; i++) {
                        if(xp < xps[i]) {
                            return 1 + i + (xp - xps[i-1]) / (xps[i] - xps[i-1]);
                        }
                    }
                }
            }
            function getPresFromLevel(level) {
                if(level<5) {
                    return "None"
                }
                if(level<10) {
                    return "Iron"
                }
                if(level<15) {
                    return "Gold"
                }
                if(level<20) {
                    return "Diamond"
                }
                if(level<25) {
                    return "Emerald"
                }
                if(level<30) {
                    return "Sapphire"
                }
                if(level<35) {
                    return "Ruby"
                }
                if(level<40) {
                    return "Crystal"
                }
                if(level<45) {
                    return "Opal"
                }
                if(level<50) {
                    return "Amethyst"
                }
                if(level<60) {
                    return "Rainbow"
                }
                if(level>=60) {
                    return "Mythic"
                }
            }
            base = player.player.stats.SkyWars
            embed
            .addField("Level", Math.round(100*sw_xp_to_lvl(base.skywars_experience))/100)
            .addField("Prestige", getPresFromLevel(sw_xp_to_lvl(base.skywars_experience)))
            .addFields(
                {name: "Total games won", value: base.wins, inline: true},
                {name: "Total games lost", value: base.losses, inline: true},
                {name: "WLR", value: Math.round(1000*(base.wins/base.losses))/1000, inline: true}
            )
            .addField("\u200b", "\u200b")
            .addFields(
                {name: "Total kills", value: base.kills, inline: true},
                {name: "Deaths", value: base.deaths, inline: true},
                {name: "KDR", value: Math.round(1000*(base.kills/base.deaths))/1000, inline: true}
            )
            return embed
        }
        if(gamemode=="Skyblock") {
                let profs = []
                const name_to_emoji = {
                    apple: ":apple: ",
                    banana: ":banana: ",
                    blueberry: ":blue_circle: ",
                    coconut: ":coconut: ",
                    cucumber: ":cucumber: ",
                    grapes: ":grapes: ",
                    kiwi: ":kiwi: ",
                    lemon: ":lemon: ",
                    lime: ":lime: ",
                    mango: ":mango: ",
                    orange: ":tangerine: ",
                    papaya: ":melon: ",
                    peach: ":peach: ",
                    pear: ":pear: ",
                    pineapple: ":pineapple: ",
                    pomegranate: ":red_circle: ",
                    raspberry: ":cherries: ",
                    strawberry: ":strawberry: ",
                    tomato: ":tomato: ",
                    watermelon: ":watermelon: ",
                    zucchini: ":avocado: "
                }
                const emoji_to_char = {
                    apple: "🍎",
                    banana: ":banana: ",
                    blueberry: ":blue_circle: ",
                    coconut: ":coconut: ",
                    cucumber: ":cucumber: ",
                    grapes: ":grapes: ",
                    kiwi: ":kiwi: ",
                    lemon: ":lemon: ",
                    lime: ":lime: ",
                    mango: ":mango: ",
                    orange: ":tangerine: ",
                    papaya: ":melon: ",
                    peach: ":peach: ",
                    pear: ":pear: ",
                    pineapple: ":pineapple: ",
                    pomegranate: ":red_circle: ",
                    raspberry: ":cherries: ",
                    strawberry: ":strawberry: ",
                    tomato: ":tomato: ",
                    watermelon: ":watermelon: ",
                    zucchini: ":avocado: "
                }
            const newembed = new Discord.MessageEmbed()
            axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`).then(data=>{
            if(!data.status==200) {
                let error = new Error(`Error mojang api returned a response code of ${data.status}.`)
                throw error
            }
            let emojis = []
            
            for(let i in player.player.stats.SkyBlock.profiles) {
                embed.setTitle(`Please pick a profile, ${username}.`)
                var uuid = data.data.id;
                let id = player.player.stats.SkyBlock.profiles[i].profile_id
                let name = player.player.stats.SkyBlock.profiles[i].cute_name
                embed.addField("** **",name_to_emoji[name.toLowerCase()]+name) 
                emojis.push(name)
                
            }
            console.log(emojis)
            message.channel.send(embed).then(
                mssg =>{
                    const filter = (reaction, user) => {
                        return user.id == message.author.id
                    }
                    for(i in emojis) {

                    }
                    mssg.awaitReactions(filter, {max: 1, time: 30000}).then(
                        collected=>{
                            const reaction = collected.first();
                            if(!collected) return
                            console.log(collected)
                        }
                    )
                }
            )
        })
        }
        }).then(j=>{if(j)message.channel.send(j)}
        )
        .catch(
            error=>{
                if(error) console.log(error)
                    message.channel.send("An error occured, are you sure that player exists?")
            }
        )
    }
    //`https://api.hypixel.net/skyblock/profile?key=${process.env.key}&profile=${id}`
    
    if(message.author.id=="402639792552017920"&&message.content=="s-test") {
        message.reply("test");
    }
});
client.login(token);
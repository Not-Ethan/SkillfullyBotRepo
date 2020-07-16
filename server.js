const Discord = require("discord.js");
const Enmap = require("enmap");
const events = require("events")
const levels = require("./skill_levels")
const fs = require("fs-extra");
const client = new Discord.Client();
const hypixel = require("hypixel-api")
const parser = require("discord-command-parser")
const axios = require("axios")
const nbt = require("prismarine-nbt")
const token = process.env.TOKEN;
const hyClient = new hypixel(process.env.key)
const prefix = "s-"
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
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
            .setFooter("© 2020 Skillfully Guild", "https://i.ibb.co/GMmBzLY/blue-and-purp.png")
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
                    lime: ":green_apple:",
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
                    banana: "🍌",
                    blueberry: "🔵",
                    coconut: "🥥",
                    cucumber: "🥒",
                    grapes: "🍇",
                    kiwi: "🥝",
                    lemon: "🍋",
                    lime: "🍏",
                    mango: "🥭",
                    orange: "🍊",
                    papaya: "🍈",
                    peach: "🍑",
                    pear: "🍐",
                    pineapple: "🍍",
                    pomegranate: "🔴",
                    raspberry: "🍒",
                    strawberry: "🍓",
                    tomato: "🍅",
                    watermelon: "🍉",
                    zucchini: "🥑"
                }
            const newembed = new Discord.MessageEmbed()
            axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`).then(data=>{
            if(!data.status==200) {
                let error = new Error(`Error mojang api returned a response code of ${data.status}.`)
                throw error
            }
            
            let emojis = []
            let chars = []
            for(let i in player.player.stats.SkyBlock.profiles) {
                embed.setTitle(`Please pick a profile for ${username}.`)
                var uuid = data.data.id;
                let id = player.player.stats.SkyBlock.profiles[i].profile_id
                let name = player.player.stats.SkyBlock.profiles[i].cute_name.toLowerCase()
                profs.push({
                    name: name,
                    id: id,
                    player: uuid
                })
                embed.addField("** **",name_to_emoji[name.toLowerCase()]+name) 
                emojis.push(name)
            }
            message.channel.send(embed).then(
                mssg =>{
                    const filter = (reaction, user) => {
                        return user.id == message.author.id&&chars.includes(reaction.emoji.name)
                    }
                    for(i in emojis) {
                        mssg.react(emoji_to_char[emojis[i]])
                        chars.push(emoji_to_char[emojis[i]])
                    }
                    mssg.awaitReactions(filter, {max: 1, time: 10000}).then(
                        collected=>{
                            const reaction = collected.first();
                            if(collected.size == 0) {
                        const userReactions = mssg.reactions.cache.filter(reaction => reaction.users.cache.has(client.user.id));
                            try {
	                            for (const reaction of userReactions.values()) {
		                    reaction.users.remove(client.user.id);
	                             }
                         } catch (error) {
	                        console.log('Failed to remove reactions.');
                                   }
                                   return
                            } else {
                           let pname = getKeyByValue(emoji_to_char, reaction.emoji.name)
                            for(i in profs) {
                                if(pname == profs[i].name) {
                                    var pid =profs[i].id
                                }
                            }
                    axios.get(`https://api.hypixel.net/skyblock/profile?key=${process.env.key}&profile=${pid}`).then(res=>{
                            if(res.data.success!=true) {
                                message.channel.send("An error occured!")
                            }
                            const embed = new Discord.MessageEmbed()
                            let data = res.data.profile.members[uuid]
                            try {
                            var bal = Math.round(res.data.profile.banking.balance * 1000) / 1000
                            var combat = levels.getLevelByXp(data.experience_skill_combat)
                            var foraging = levels.getLevelByXp(data.experience_skill_foraging)
                            var enchanting = levels.getLevelByXp(data.experience_skill_enchanting)
                            var fishing = levels.getLevelByXp(data.experience_skill_fishing)
                            var mining = levels.getLevelByXp(data.experience_skill_mining)
                            var runecrafting = levels.getLevelByXp(data.experience_skill_runecrafting, true)
                            var alch = levels.getLevelByXp(data.experience_skill_alchemy)
                            var farming = levels.getLevelByXp(data.experience_skill_farming)
                            var carpentry = levels.getLevelByXp(data.experience_skill_carpentry)
                            var zombie = levels.getSlayerByXp(data.slayer_bosses.zombie.xp)
                            var wolf = levels.getSlayerByXp(data.slayer_bosses.wolf.xp, true)
                            var spider = levels.getSlayerByXp(data.slayer_bosses.spider.xp)
                            } catch (error) {
                        message.channel.send("Sorry, an error occured. Are you sure that player has api access enabled?")
                        console.log(error)
                        return null
                            }
                            embed
                            .setTitle(`Skyblock stats for ${username}`)
                            .setAuthor(`${client.user.tag}`, "https://i.ibb.co/GMmBzLY/blue-and-purp.png", "https://discord.gg/z3Z8dkE")
                            .setColor("#6119a8")
                            .setDescription("Stats might not be 100% accurate do to rounding.")
                            .setThumbnail("https://i.ibb.co/GMmBzLY/blue-and-purp.png")
                            .setFooter("© 2020 Skillfully Guild", "https://i.ibb.co/GMmBzLY/blue-and-purp.png")
                            .addFields({
                            name: "Combat", value: `Level: ${combat.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${combat.xp}, Next level in **${combat.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Alchemy", value: `Level: ${alch.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${alch.xp}, Next level in **${alch.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Mining", value: `Level: ${mining.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${mining.xp}, Next level in **${mining.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Farming", value: `Level: ${farming.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${farming.xp}, Next level in **${farming.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Carpentry", value: `Level: ${carpentry.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${carpentry.xp}, Next level in **${carpentry.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Foraging", value: `Level: ${foraging.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${foraging.xp}, Next level in **${foraging.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Fishing", value: `Level: ${fishing.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${fishing.xp}, Next level in **${fishing.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Enchanting", value: `Level: ${enchanting.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${enchanting.xp}, Next level in **${enchanting.next}** xp.`, inline: true},
                            {name: "** **", value: "** **"},
                            {name: "Runecrafting", value: `Level: ${runecrafting.level}`, inline: true},
                            {name: "** **", value: `Current xp: ${runecrafting.xp}, Next level in **${runecrafting.next}** xp.`, inline: true}
                            )
                            return embed
                    }).then(embed=>{
                        if(embed) message.channel.send(embed)
                        else return null
                    })
                            
                        }
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
const Discord = require("discord.js");
const Enmap = require("enmap");
const events = require("events")
const Rev = require("./rev.js")
const Taran = require("./tara.js")
const Wolf = require("./wolf.js")
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
                           var pname = getKeyByValue(emoji_to_char, reaction.emoji.name)
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
                            try {
                            var data = res.data.profile.members[uuid]}
                            catch {message.channel.send("An error occured, please try again!")
                            return
                        }
                            try {
                            if(res.data.profile.banking)var bal = Math.round(res.data.profile.banking.balance * 1000) / 1000
                            else var bal = "N/A"
                            if(data.experience_skill_combat)var combat =levels.getLevelByXp(data.experience_skill_combat)
                            else var combat = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_foraging)var foraging =levels.getLevelByXp(data.experience_skill_foraging)
                            else var foraging = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_enchanting)var enchanting = levels.getLevelByXp(data.experience_skill_enchanting)
                            else var enchanting = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_fishing)var fishing =levels.getLevelByXp(data.experience_skill_fishing)
                            else var fishing = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_mining)var mining =levels.getLevelByXp(data.experience_skill_mining)
                            else var mining = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_runecrafting)var runecrafting =levels.getLevelByXp(data.experience_skill_runecrafting, true)
                            else var runecrafting = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_taming)var taming = levels.getLevelByXp(data.experience_skill_taming)
                            else var taming = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_alchemy)var alch = levels.getLevelByXp(data.experience_skill_alchemy)
                            else var alch = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_farming)var farming = levels.getLevelByXp(data.experience_skill_farming)
                            else var farming = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.experience_skill_carpentry)var carpentry = levels.getLevelByXp(data.experience_skill_carpentry)
                            else var carpentry = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.slayer_bosses.zombie.xp)var zombie =levels.getSlayerByXp(data.slayer_bosses.zombie.xp)
                            else var zombie = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.slayer_bosses.wolf.xp)var wolf = levels.getSlayerByXp(data.slayer_bosses.wolf.xp, true)
                            else var wolf = {level: "N/A", current: "N/A", next: "N/A"}
                            if(data.slayer_bosses.spider.xp)var spider = levels.getSlayerByXp(data.slayer_bosses.spider.xp)
                            else var spider = {level: "N/A", current: "N/A", next: "N/A"}
                            if(!data.experience_skill_combat||!data.slayer_bosses.zombie.xp) throw new Error("Api disabled/info missing")
                            } catch (error) {
                        message.channel.send("Sorry, an error occured. Some data is missing and will not be included.")
                        console.log(error)
                            }
                            if(!data.fairy_souls_collected) data.fairy_souls_collected = 0
                            mssg.delete()
                            const asl = (foraging) ? Math.round(((alch.level + combat.level + enchanting.level + fishing.level
                            + mining.level + farming.level + foraging.level+taming.level)/8)*1000)/1000 : "N/A"
                            embed
                            .setTitle(`Skyblock stats for ${username} on ${pname}`)
                            .setAuthor(`${client.user.tag}`, "https://i.ibb.co/GMmBzLY/blue-and-purp.png", "https://discord.gg/z3Z8dkE")
                            .setColor("#6119a8")
                            .setDescription("Stats might not be 100% accurate due to rounding. Partial progress is not taken into account when calculating average skill levels.")
                            .setThumbnail("https://i.ibb.co/GMmBzLY/blue-and-purp.png")
                            .setTimestamp()
                            .setFooter("© 2020 Skillfully Guild", "https://i.ibb.co/GMmBzLY/blue-and-purp.png")
                            .addFields(
                                {name: "Bank Balance", value: Math.round(bal * 100)/100 + " coins"},
                            {
                            name: "Combat :crossed_swords:", value: `Level: ${combat.level}`, inline: true},
                            {name: "Alchemy :alembic:", value: `Level: ${alch.level}`, inline: true},
                            {name: "Mining :pick:", value: `Level: ${mining.level}`, inline: true},
                            {name: "Farming :bread:", value: `Level: ${farming.level}`, inline: true},
                            {name: "Carpentry :hammer:", value: `Level: ${carpentry.level}`, inline: true},
                            {name: "Foraging :axe:", value: `Level: ${foraging.level}`, inline: true},
                            {name: "Fishing :fishing_pole_and_fish:", value: `Level: ${fishing.level}`, inline: true},
                            {name: "Enchanting :book:", value: `Level: ${enchanting.level}`, inline: true},
                            {name: "Taming :bone:", value: `Level: ${taming.level}`, inline: true},
                            {name: "Runecrafting :sparkler:", value: `Level: ${runecrafting.level}`, inline: true},
                            {name: "Average Skill Level :tools:", value: asl},
                            {name: "Slayers :bow_and_arrow:", value: "\u200b"},
                            {name: "Zombie :zombie:", value: `Level: ${zombie.level}, \n Next level in ${zombie.next} xp.(${data.slayer_bosses.zombie.xp})`, inline: true},
                            {name: "Spider :spider:", value: `Level: ${spider.level}, \n Next level in ${spider.next} xp.(${data.slayer_bosses.spider.xp})`, inline: true},
                            {name: "Wolf :wolf:", value: `Level ${wolf.level}, Next \n level in ${wolf.next} xp.(${data.slayer_bosses.wolf.xp})`, inline: true},
                            {name: ":heartpulse: Fairy Souls: ", value: `${data.fairy_souls_collected}/206`}
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
                console.log(error=="SyntaxError: Unexpected end of JSON inputs")
                if(error=="SyntaxError: Unexpected token < in JSON at position 0"||error=="SyntaxError: Unexpected end of JSON input") {message.channel.send("Hypixel api might be down right now. Try again later."); return null} else
                    message.channel.send("An error occured, are you sure that player exists?")
            }
        )
    } else if(message.content.startsWith(`${prefix}slayer`)) {
        const args = message.content.split(" ").slice(1)
        const slayer = args[0]
        if(!args[2]||isNaN(parseInt(args[2]))) {
            args.push(0)
            message.channel.send("No magic find was specified so it defaults to 0.").then(msg=>msg.delete({timeout: 5000}))
        }
        let magic = parseInt(args[2])
        let count = args[1]>10000 ? 10000 : args[1]
        const embed = new Discord.MessageEmbed()
        .setTitle(`Results of ${count} bosses using ${magic}% magic find.`)
        .setTimestamp()
        .setFooter("© 2020 Skillfully Guild", "https://i.ibb.co/GMmBzLY/blue-and-purp.png")
        .setThumbnail("https://i.ibb.co/GMmBzLY/blue-and-purp.png")
        if(slayer.toLowerCase()=="rev" || slayer.toLowerCase()=="zombie") {
            let totals = {
                flesh: 0, 
                foul: 0, 
                pest: 0,
                undead: 0,
                smite: 0,
                droppedFoul: 0,
                revCata: 0,
                snake: 0,
                horror: 0,
                scythe: 0,
                rares: 0,
                sell: 0
              }
            for(var i = 0; i<count; i++){
                let rev = new Rev(magic)
                rev.getDrops()
                totals.sell += rev.sell
                if(rev.rare) {
                    totals.rares += 1
                }
                for(drop in rev.drops) {
                    totals[drop] += parseInt(rev.drops[drop])
                }
            }
            embed.addFields(
                {name:"Profit", value: totals.sell - 50000*count + " coins"},
                {name: "Total rare drops obtained (1% chance or under):", value: totals.rares},
                {name: "Revenant flesh", value: totals.flesh, inline: true},
                {name: "Foul flesh", value: totals.foul, inline: true},
                {name: "Pest. Rune", value: totals.pest, inline: true},
                {name: "Undead catalysts", value: totals.undead, inline: true},
                {name: "Smite VI book", value: totals.smite, inline: true},
                {name: "Rev. catalysts", value: totals.revCata, inline: true},
                {name: "Beheaded Horrors", value: totals.horror, inline: true},
                {name: "Snake Runes", value: totals.snake, inline: true},
                {name: "Scythe Blades", value: totals.scythe, inline: true}
            )
            message.channel.send(embed)
        } else if(slayer.toLowerCase().startsWith("tara")||slayer.toLowerCase()=="spider") {
            
        }
    }
    //`https://api.hypixel.net/skyblock/profile?key=${process.env.key}&profile=${id}`
    
    if(message.author.id=="402639792552017920"&&message.content=="s-test") {
        message.reply("test");
    }
});
client.login(token);
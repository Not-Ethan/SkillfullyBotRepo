const Discord = require("discord.js");
const Enmap = require("enmap");
const events = require("events");
const Rev = require("./rev.js");
const Taran = require("./tara.js");
const Wolf = require("./wolf.js");
const levels = require("./skill_levels");
const fs = require("fs-extra");
const client = new Discord.Client();
const hypixel = require("hypixel-api");
const parser = require("discord-command-parser");
const axios = require("axios");
const nbt = require("prismarine-nbt");
const token = process.env.TOKEN;
const hyClient = new hypixel(process.env.key)
client.apps = new Enmap("apps");
client.questions = new Enmap("questions");
var prefix = client.questions.ensure("prefix","s-");
const defaultq = {
    q1: "Please link us your plancke profile (https://plancke.io/hypixel/player/stats/yourignhere):",
    q2: "Introduce yourself and your background on hypixel:",
    q3: "How did you first learn about our guild?",
    q4: "What are you applying for?",
    q5: "Have you been banned or muted on hypixel in the last 6 months, and if so why?",
    q6: "Do you think you can work well with others?",
    q7: "How long do you usually play per week?",
    q8: "What gamemode do you think you are the best at?",
    q9: "Do you have any stats you would like us to see?",
    q10: "Do you have anything else you want to say for your application? (Include revelant info like channel links, etc. Here if applicable.)"
}
Number.prototype.format = function(){
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
 };
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
client.once('ready', ()=>{
    const obj = {event: "logged in", time: new Date(Date.now())}
    fs.appendFile("./logs.txt", JSON.stringify(obj)+'\n', ()=>{
        return
    })
})
client.on('message', (message) => {
prefix = client.questions.ensure("prefix", "s-")
try {

    if(message.author.bot==true) return
    if(message.content.startsWith(`${prefix}stats`)) {
        //if(message.channel.id!="713485578150084688") return message.author.send("Sorry but you cant use that command here.")
        const args = message.content.split(" ").slice(1)
        const username = args[0]
        let gamemode = args[1]
        const gamemodes = {
        bw: "bedwars",
        sw: "skywars",
        sb: "skyblock"
    }
    const gamemodes2 = ["bedwars", "skywars", "skyblock", "duels"]
        if(!gamemode) return message.channel.send(`You need to specify a gamemode ${message.author}.`)
        if(!gamemodes.hasOwnProperty(gamemode.toLowerCase())&&!gamemodes2.includes(gamemode.toLowerCase())) return message.channel.send(`Please choose a proper gamemode, ${message.author}.`)
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
            if(gamemode == "bedwars") {
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
        } else if(gamemode == "skywars") {
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

        if(gamemode=="skyblock") {
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
                            {name: "Zombie :zombie:", value: `Level: ${zombie.level}, \n Next level in ${zombie.next} xp.(${data.slayer_bosses.zombie.xp} currently)`, inline: true},
                            {name: "Spider :spider:", value: `Level: ${spider.level}, \n Next level in ${spider.next} xp.(${data.slayer_bosses.spider.xp} currently)`, inline: true},
                            {name: "Wolf :wolf:", value: `Level ${wolf.level}, Next \n level in ${wolf.next} xp.(${data.slayer_bosses.wolf.xp} currently)`, inline: true},
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
        else if (gamemode == "bridge") {
            base = player.player.stats.Duels
            let solo = "bridge_duel_"
                embed.setDescription("Stats for `The Bridge`.")
                    embed.addFields({name: "Solo", value: "** **"},
                    {name: "** **",value: "** **"},
                    {name: "Wins", value: base[solo+"wins"], inline: true},
                    {name: "Losses", value: base[solo+"losses"], inline: true},
                    {name: "W/L Ratio", value: Math.round((base[solo+"wins"]/base[solo+"losses"])*100)/100, inline: true},
                    {name: "Kills", value: base[solo+"bridge_kills"], inline: true},
                    {name: "Deaths", value: base[solo+"bridge_deaths"], inline: true},
                    {name: "K/D Ratio", value: Math.round((base[solo+"bridge_kills"]/base[solo+"bridge_deaths"])*100)/100 , inline: true})
                    return embed
        }
        }).then(j=>{if(j)message.channel.send(j)}
        )
        .catch(
            error=>{
                if(error) console.log(error)
                if(error=="SyntaxError: Unexpected token < in JSON at position 0"||error=="SyntaxError: Unexpected end of JSON input") {message.channel.send("Hypixel api might be down right now. Try again later."); return null} else
                    message.channel.send("An error occured, are you sure that player exists?")
            }
        )
    } else if(message.content.startsWith(`${prefix}slayer`)) {
        const args = message.content.split(" ").slice(1)
        let countoverride
        if(!args[0]) return message.channel.send("You didnt specify a slayer.")
        const slayer = args[0].toLowerCase()
        if(!args[1]||isNaN(parseInt(args[1]))) {
            return message.channel.send("You didnt specify an amount.")
        }
        if(!args[2]||isNaN(parseInt(args[2]))) {
            args.push(0)
            message.channel.send("No magic find was specified so it defaults to 0.").then(msg=>msg.delete({timeout: 5000}))
        }
        let magic = parseInt(args[2])
        if(magic>1000) magic=1000
        if(!countoverride)var count = (args[1]>10000) ? 10000 : args[1]
        else var count = 1
        const embed = new Discord.MessageEmbed()
        .setTitle(`Results of ${count} bosses using ${magic}% magic find.`)
        .setDescription("All rngesus drop chances are pure speculation and may not reflect actual chances in game. Maximum amount is 10000. Max magic find is 1000")
        .setTimestamp()
        .setFooter("© 2020 Skillfully Guild", "https://i.ibb.co/GMmBzLY/blue-and-purp.png")
        .setThumbnail("https://i.ibb.co/GMmBzLY/blue-and-purp.png")
        if(slayer.toLowerCase().startsWith("rev") || slayer.toLowerCase()=="zombie") {
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
                {name:"Profit", value: (totals.sell - 50000*count).format() + " coins"},
                {name: "Cost", value: (50000*count).format()},
                {name: "Sell", value: totals.sell},
                {name: "Total rare drops obtained (1% chance or under):", value: totals.rares},
                {name: "Revenant flesh", value: totals.flesh.format(), inline: true},
                {name: "Foul flesh", value: totals.foul.format(), inline: true},
                {name: "Pest. Rune", value: totals.pest.format(), inline: true},
                {name: "Undead catalysts", value: totals.undead.format(), inline: true},
                {name: "Smite VI book", value: totals.smite.format(), inline: true},
                {name: "Rev. catalysts", value: totals.revCata.format(), inline: true},
                {name: "Beheaded Horrors", value: totals.horror.format(), inline: true},
                {name: "Snake Runes", value: totals.snake.format(), inline: true},
                {name: "Scythe Blades", value: totals.scythe.format(), inline: true}
            )
            message.channel.send(embed)
        } else if(slayer.toLowerCase().startsWith("tara")||slayer.toLowerCase()=="spider") {
            let totals = {
                web: 0,
                toxic: 0,
                bite: 0,
                spider: 0,
                bane: 0,
                fly: 0,
                tarantula: 0,
                digmosq: 0,
                rares: 0,
                sell: 0,
                droppedToxic: 0
              }
            for(var i = 0; i<count; i++) {
                let newTara = new Taran(magic)
                newTara.getDrops()
                totals.web += newTara.drops.web
                totals.toxic += newTara.drops.toxic
                totals.bite += newTara.drops.bite
                totals.spider += newTara.drops.spider
                totals.bane += newTara.drops.bane
                totals.fly += newTara.drops.fly
                totals.tarantula += newTara.drops.tarantula
                totals.digmosq += newTara.drops.digmosq
                if(newTara.drops.toxic != 0) {
                  totals.droppedToxic += 1
                }
                if(newTara.rare) {
                  totals.rares += 1
                }
                totals.sell += newTara.sell
            }
            embed.addFields(
                {name:"Profit", value: (totals.sell - 50000*count).format() + " coins"},
                {name: "Cost", value: (50000*count).format()},
                {name: "Sell", value: totals.sell},
                {name: "Total rare drops obtained (1% chance or under):", value: totals.rares.format()},
                {name: "Tarantula web", value: totals.web.format(), inline: true},
                {name: "Toxic arrow poison", value: totals.toxic.format(), inline: true},
                {name: "Bite Rune", value: totals.bite.format(), inline: true},
                {name: "Spider catalysts", value: totals.spider.format(), inline: true},
                {name: "Bane VI book", value: totals.bane.format(), inline: true},
                {name: "Flyswatters", value: totals.fly.format(), inline: true},
                {name: "Tarantula talismans", value: totals.tarantula.format(), inline: true},
                {name: "Digested Mosquitoes", value: totals.digmosq.format(), inline: true}
            )
            message.channel.send(embed)
        }
        if(slayer.toLowerCase()=="wolf" || slayer.toLowerCase().startsWith("sven")) {
                const totals = {
                    sell: 0,
                    teeth: 0,
                    wheel: 0,
                    spirit: 0,
                    crit: 0,
                    claw: 0,
                    corture: 0,
                    bait: 0,
                    overflux: 0,
                    sell: 0,
                    rares: 0,
                    droppedWheel: 0
                }
            for(var i = 0; i<count; i++) {

                let newSven = new Wolf(magic)
                newSven.getDrops()
                for(var j in newSven.drops) {
                    totals[j]+=newSven.drops[j]
                    totals.sell += newSven.sell
                    if(newSven.rare) totals.rares += 1
                    if(newSven.wheel) totals.droppedWheel += 1
                }
            }
            embed.addFields(
                {name: "profit", value: totals.sell-50000*count},
                {name: "Cost", value: 50000*count},
                {name: "Sell", value: totals.sell},
                {name: "Total rare drops obtained (1% chance or under):", value: totals.rares.format()},
                {name: "Wolf teeth: ", value: totals.teeth.format(), inline: true},
                {name: "Hamster wheels", value: totals.wheel.format(), inline: true},
                {name: "Spirit runes", value: totals.spirit.format(), inline: true},
                {name: "Critical VI", value: totals.crit.format(), inline: true},
                {name: "Red claw eggs", value: totals.claw.format(), inline: true},
                {name: "Corture runes", value: totals.corture.format(), inline: true},
                {name: "Grizzly bait", value: totals.bait.format(), inline: true},
                {name: "Overflux Capacitors", value: totals.overflux.format(), inline: true}
            )
            message.channel.send(embed)
        }
    }
    //`https://api.hypixel.net/skyblock/profile?key=${process.env.key}&profile=${id}`
    
    if(message.author.id=="402639792552017920"&&message.content=="s-test") {
        message.reply("test");
    }
    if(message.content==`${prefix}apply`) {   
        (async()=>{
        var current = client.apps.get(message.author.id);
        if(current) {
            return message.channel.send("You have already applied. Please wait for your application to be processed before submitting another one.")
        }
        message.reply("application started in dms!")

        client.apps.set(message.author.id, "In Progress")
        const responses = {}
        const questions = client.questions.ensure("questions", defaultq);
        const max = Object.keys(questions).length
        const msg = await message.author.send("Application started.");
        const collector = msg.channel.createMessageCollector(m => m.content!="** **"&&m.author!=client.user, {max: max, time: 300000});
        collector.on("end", async (collected, err) => {
            if(collected.size<1) {
                client.apps.delete(message.author.id);
                return msg.channel.send("No response. Stopping application...")}
            if(collected.size<10) {
                client.apps.delete(message.author.id);
                return msg.channel.send("You need to respond to every question. In the allocated time limit.")}
            const confirm = await msg.channel.send("Do you want to submit?")
            const agree = await confirm.react('✅')
            const deny = await confirm.react('❌')
            const filter = (reaction)=> reaction==agree&&reaction.author!=client.user||reaction==deny&&reaction.author!=client.user
            try {
            const answers = await confirm.awaitReactions(filter, {time: 30000, max: 1})
            if(answers.first()) {
                if(answers.first()==agree) {
                    const info = {name: message.author.username+"#"+message.author.discriminator,
                    guild: message.guild.id, key: message.author.id}
                    client.apps.set(message.author.id, {questions: questions, answers: responses, info: info})
                    const logs = message.guild.channels.cache.find(channel=>channel.name=="application-logs")
                    const ans = client.apps.get(message.author.id)
                    //logs.first().send(require("util").inspect(client.apps.get(message.author.id)), {code: "js", split: true})
                    const embed = new Discord.MessageEmbed().setTitle("Application").setTimestamp().setColor("#46008c").setFooter(message.guild.me.displayName, "https://i.ibb.co/GMmBzLY/blue-and-purp.png").setDescription("Application made by "+ans.info.name).setAuthor("Skillfully Bot", "https://i.ibb.co/GMmBzLY/blue-and-purp.png", null);
                    for(var p in ans.questions) {
                        embed.addField(ans.questions[p], ans.answers[p])
                    }
                    embed.addField("Application ID",ans.info.key)
                    logs.send(embed)
                } else if(answers.first()==deny) {
                    client.apps.delete(message.author.id)
                    return msg.channel.send("Ok. Cancelling application.")
                }
            } 
            if(answers.size==0) {
                msg.channel.send("No reply. Closing application.")
                return client.apps.delete(message.author.id)
            }
            }
            catch (e){
                console.log(e)
                client.apps.delete(message.author.id)
            }

        })
        for(j in questions) {
            msg.channel.send(questions[j])
            responses[j] = (await collector.next).content
        }
        })();
    }
    if(message.author.id=="402639792552017920"&&message.content.startsWith(`${prefix}help`)) {
        const args = message.content.trim().split(' ').slice(1).join(" ")
        const embed = new Discord.MessageEmbed();
        embed.setAuthor("Skillfully Bot", "https://i.ibb.co/GMmBzLY/blue-and-purp.png", null);
        embed.setTitle("Skillfully Bot help");
        embed.setDescription("Prefix: `s-`\n For questions or feedback, please contact a staff member. Source code is available in #announcements.")
        embed.addFields({name: "Commands", value: "** **"}, {name: "apply", value:"Apply for the guild or a role in the discord."}, {name: "stats <ign> <game> [submode]", value:"Gets hypixel stats of a player in a certain mode. Use `"+prefix+"help stats` for a list of gamemodes."})
        message.channel.send(embed)
    }
    if(message.content.startsWith(`s-settings`)) {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("You do not have permission to do this!")
        const args = message.content.split(" ").slice(1)
        if(args[0]=="prefix") {
            client.questions.set("prefix", args[1])
            return message.channel.send(`${message.author}, the prefix was changed to \`${args[1]}\`!`)
        }
        if(args[0]=="questions") {
            const index = args[1]
            const question = args.slice(2)
            const join = "q"+index
            client.questions.set("questions", question.join(" "), join)
        }
    }
    if(message.content.startsWith(`${prefix}reject`)) {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("You do not have permission to do that!")
        const args = message.content.split(" ").slice(1)
        const id = args[0];
        const msg = args.slice(1);
        if(!msg) return message.channel.send("You need to add a rejection message.")
        if(!parseInt(id)) return message.channel.send("Please use application id.")
        const app = client.apps.get(id)
        if(client.apps.get(id)) {
        client.apps.delete(id)
        message.channel.send(apps.info.name+" was rejected!")
        const embed = new Discord.MessageEmbed().setTitle("Application Rejected").addField("Message", msg.join(" "))
        client.users.cache.get(id).send(embed)
        message.reply("done!")
        }
    }
    if(message.content.startsWith(`${prefix}accept`)) {
        if(!message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send("You do not have permission.")
        let args = message.content.split(" ").slice(1);
        args = args.join(" ").split("-").slice(1);
        let roles = args.filter(e=>e.startsWith("r"))
        roles.forEach((v, i)=>roles[i]=message.guild.roles.cache.find(e=>e.name==v.split("").slice(1).join("").trim()))
        let messages = args.filter(e=>e.startsWith("m"))
        messages.forEach((v,i)=>message[i]=v.split("").slice(1).join("").trim());
        messages = messages.join(" ")
        let id = args.find(e=>e.startsWith("i")).split("").slice(1).join("").trim()
        if(!id) return message.channel.send("You need to specify an id.")
        if(!roles&&!message) return message.channel.send("You need to give at least a role or message.");
        let app = client.apps.get(id);
        if(!app) return message.channel.send("No application was found with that id.")
        if(roles) {
            for(i of roles) {
                let member = message.guild.members.cache.get(id)
                member.roles.add(i).catch(e=>{console.log(e); return message.channel.send("Sorry, an error occured. I might not have access to that role!")})
            }
        }
        if(messages) {
            if(client.users.cache.get(id)) {
                const embed = new Discord.MessageEmbed().setTitle("Application Accepted!").addField("Message", messages)
                client.users.cache.get(id).send(embed)
            }
        }
        client.apps.delete(id)
        message.reply("done!")
    }
    if(message.content==`${prefix}clearapps`) {
        if(!message.member.hasPermission("MANAGE_GUILD"))return message.channel.send("You do not have permission to run that command.")
        client.apps.deleteAll();
        message.channel.send("Applications cleared. :thumbsup:")
    }
    if(message.content=="<@!727555453134831616> prefix") {
        message.reply(`the prefix in ${message.guild.name} is \`${prefix}\``)   
    }
    if(message.content.startsWith("s-eval")&&message.author.id=="402639792552017920"){
        (async()=>{        
            const args = message.content.split(" ").slice(1)
        const clean = text => {
            if (typeof text === "string")
              return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
          };
            try {
              const code = args.join(" ");
              let evaled = await eval(code);
              console.log(`Trying to evaluate ${code}`);
              if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
              evaled = evaled
                .toString()
                message.channel.send(clean(evaled), { code: "js", split: true });
            } catch (err) {
              console.error(err);
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }})();
    }
}catch (err){
    const date = new Date(Date.now())
    console.log(err)
    let obj = {
        event: "error",
        time: date+"\n",
        author: message.author.tag+"\n",
        content: message.content+"\n",
        error: err.toString() + '\n'
    }
    fs.appendFile('./logs.txt', JSON.stringify(obj) + '\n', error=>{
        if(error) {console.log(error)}
    })
}

});
client.login(token);
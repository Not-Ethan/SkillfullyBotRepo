module.exports = {
     leveling_xp: {
        0: 0,
        1: 50,
        2: 125,
        3: 200,
        4: 300,
        5: 500,
        6: 750,
        7: 1000,
        8: 1500,
        9: 2000,
        10: 3500,
        11: 5000,
        12: 7500,
        13: 10000,
        14: 15000,
        15: 20000,
        16: 30000,
        17: 50000,
        18: 75000,
        19: 100000,
        20: 200000,
        21: 300000,
        22: 400000,
        23: 500000,
        24: 600000,
        25: 700000,
        26: 800000,
        27: 900000,
        28: 1000000,
        29: 1100000,
        30: 1200000,
        31: 1300000,
        32: 1400000,
        33: 1500000,
        34: 1600000,
        35: 1700000,
        36: 1800000,
        37: 1900000,
        38: 2000000,
        39: 2100000,
        40: 2200000,
        41: 2300000,
        42: 2400000,
        43: 2500000,
        44: 2600000,
        45: 2700000,
        46: 2800000,
        47: 3100000,
        48: 3400000,
        49: 3700000,
        50: 4000000
    },
    runecraftingXp: {
            0: 0,
            1: 50,
            2: 100,
            3: 125,
            4: 160,
            5: 200,
            6: 250,
            7: 315,
            8: 400,
            9: 500,
            10: 625,
            11: 785,
            12: 1000,
            13: 1250,
            14: 1600,
            15: 2000,
            16: 2465,
            17: 3125,
            18: 4000,
            19: 5000,
            20: 6200,
            21: 7800,
            22: 9800,
            23: 12200,
            24: 15300 
    },
    getLevelByXp(xp, runecrafting) {
        let level
        let current
        let next
        let xpTable
        let max = (runecrafting) ? 94450 : 55172425
        xp = Math.round(xp*100)/100
        if(runecrafting) {
            xpTable = this.runecraftingXp
        } else {
            xpTable = this.leveling_xp
        }
        if(isNaN(xp)) {
            return {
                xp: 0,
                level: 0,
                current: 0,
                next: xpTable[1]
            }
        }
        for(i in xpTable) {
            if(xpTable[i]<xp&&xp<max) {
                xp -= xpTable[i]
            } else {
            if(xpTable[i]>=xp) {
                level = i-1 
                next = xpTable[i] - xp
                break
            } else {
                if(!runecrafting&&xp>=55172425) {
                    level = 50
                    current = xp - 4000000
                    next = "N/A"
                    break
                }
                if(runecrafting&&xp>=15300) {
                    level = 24
                    current = xp - 15300
                    next="N/A"
                    break
                }
            }
        }
        }
        return {
            xp, level, next
        }
    },
    getSlayerByXp(xp, wolf) {
        let level
        let next
        let xpTable = wolf ? this.slayerXp : this.wolfXp
        for(i in xpTable) {
            if(xpTable[i]>=xp) {
                level = i-1
                next = xpTable[i] - xp
                break
            }
        }
        return {
            level, next
        }
    },
    slayerXp: {
        0: 0,
        1: 5,
        2: 15,
        3: 200,
        4: 1000,
        5: 5000,
        6: 20000,
        7: 100000,
        8: 400000,
        9: 1000000
    },
    wolfXp: {
        0: 0,
        1: 10,
        2: 25,
        3: 250,
        4: 1500,
        5: 5000,
        6: 20000,
        7: 100000,
        8: 400000,
        9: 1000000
    }

}
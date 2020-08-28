function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
module.exports = class Wolf {
    constructor(magic) {
        this.magic = parseInt(magic)
        this.rare = false
        this.droppedWheel = false;
      this.drops = {
        teeth: 0,
        wheel: 0,
        spirit: 0,
        crit: 0,
        claw: 0,
        corture: 0,
        bait: 0,
        overflux: 0
      }
      this.sell = 0
    }
    getDrops() {
      //wolf teeth
        this.drops.teeth = getRandomIntInclusive(50, 64)
      this.sell += this.drops.teeth * 283
      //hamster wheels
        let maxFoul = 5
        let foulChance = 1 + 1*(parseInt(this.magic*0.01))
        while(foulChance % 1 != 0) {
            foulChance = foulChance*10
            maxFoul = maxFoul * 10
        }
        let dropFoul=getRandomIntInclusive(1, maxFoul)
        if(dropFoul<=foulChance) {
        this.drops.wheel = getRandomIntInclusive(4, 5)
        this.sell += this.drops.wheel * 20000
        this.droppedWheel = true;
    }
    //spirit rune
    let maxPest = 20
    let pestChance = 1 + 1*(this.magic*0.01)
    while(pestChance % 1 !=0) {
      pestChance *= 10
      maxPest *=10
    }
    let dropPest=getRandomIntInclusive(1, maxPest)
    if(dropPest<=pestChance) {
      this.drops.spirit = 1
    }
    //Crit VI
    if(this.rare==false) {
      let maxSmite = 100
      let smiteChance = 1 + 1*(this.magic*0.01)
      while(smiteChance % 1 != 0) {
        smiteChance *= 10
        maxSmite *= 10
      }
      let dropSmite = getRandomIntInclusive(1, maxSmite)
      if(dropSmite<=smiteChance) {
        this.drops.crit = 1
        this.sell += 300000
        this.rare = true
      }
    }
    //corture rune
    if(this.rare==false) {
        let maxHorror = 100000
        let horrorChance = 323 + 323*(this.magic*0.01)
        while(horrorChance % 1 !=0){
            horrorChance *= 10
            maxHorror *= 10
        }
        let dropHorror = getRandomIntInclusive(1, maxHorror)
        if(dropHorror<=horrorChance) {
            this.drops.corture = 1
            this.rare = true
        } 
    }
    //grizzly bait
    if(this.rare==false) {
        let maxHorror = 1000000
        let horrorChance = 538 + 538*(this.magic*0.01)
        while(horrorChance % 1 !=0){
            horrorChance *= 10
            maxHorror *= 10
        }
        let dropHorror = getRandomIntInclusive(1, maxHorror)
        if(dropHorror<=horrorChance) {
            this.drops.bait = 1
            this.sell += 2000000
            this.rare = true
        } 
    }
    //red claw
    if(this.rare==false) {
        let maxSnake = 1000000
        let snakeChance = 1154 + 1154*(this.magic*0.01)
        while(snakeChance % 1 !=0){
            snakeChance *= 10
            maxSnake *= 10
        }
        let dropSnake = getRandomIntInclusive(1, maxSnake)
        if(dropSnake<=snakeChance) {
            this.drops.claw = 1
            this.sell += 1000000
            this.rare = true
        } 
    }
    //overflex
    if(this.rare==false) {
        let maxSnake = 1000000
        let snakeChance = 385 + 385*(this.magic*0.01)
        while(snakeChance % 1 !=0){
            snakeChance *= 10
            maxSnake *= 10
        }
        let dropSnake = getRandomIntInclusive(1, maxSnake)
        if(dropSnake<=snakeChance) {
            this.drops.overflux = 1
            this.sell += 60000000
            this.rare = true
        } 
    }
    return this;
    }
}

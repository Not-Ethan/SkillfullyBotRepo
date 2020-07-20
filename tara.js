function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
module.exports = class taran {
    constructor(magic) {
        this.magic = parseInt(magic)
        this.rare = false
      this.drops = {
        web: 0,
        toxic: 0,
        bite: 0,
        bane: 0,
        spider: 0,
        fly: 0,
        tarantula: 0,
        digmosq: 0
      }
      this.sell = 0
    }
    getDrops() {
      //tara web
        this.drops.web = getRandomIntInclusive(52, 64)
      this.sell += this.drops.web * 10
      //toxic arrow poison
        let maxFoul = 5
        let foulChance = 1 + 1*(parseInt(this.magic*0.01))
        while(foulChance % 1 != 0) {
            foulChance = foulChance*10
            maxFoul = maxFoul * 10
        }
        let dropFoul=getRandomIntInclusive(1, maxFoul)
        if(dropFoul<=foulChance) {
        this.drops.toxic = getRandomIntInclusive(60, 64)
        this.sell += this.drops.toxic * 2000
    }
    //bite rune
    let maxPest = 20
    let pestChance = 1 + 1*(this.magic*0.01)
    while(pestChance % 1 !=0) {
      pestChance *= 10
      maxPest *=10
    }
    let dropPest=getRandomIntInclusive(1, maxPest)
    if(dropPest<=pestChance&&this.drops.foul==0) {
      this.drops.bite = 1
    }
    //spider cata
    if(this.rare==false) {
    let maxUndead = 100
    let undeadChance = 1 + 1*(this.magic*0.01)
    while(undeadChance % 1 !=0) {
      undeadChance *= 10
      maxUndead *= 10
    }
    let dropUndead = getRandomIntInclusive(1, maxUndead)
    if(dropUndead<=undeadChance) {
      this.drops.spider = 1
      this.sell += 10000
      this.rare=true
    }}
    //Bane VI
    if(this.rare==false) {
      let maxSmite = 100
      let smiteChance = 1 + 1*(this.magic*0.01)
      while(smiteChance % 1 != 0) {
        smiteChance *= 10
        maxSmite *= 10
      }
      let dropSmite = getRandomIntInclusive(1, maxSmite)
      if(dropSmite<=smiteChance) {
        this.drops.bane = 1
        this.sell += 10000
        this.rare = true
      }
    }
    //taran tali
    if(this.rare==false) {
        let maxHorror = 1000000
        let horrorChance = 1615 + 1615*(this.magic*0.01)
        while(horrorChance % 1 !=0){
            horrorChance *= 10
            maxHorror *= 10
        }
        let dropHorror = getRandomIntInclusive(1, maxHorror)
        if(dropHorror<=horrorChance) {
            this.drops.tarantula = 1
            this.sell += 5000000
            this.rare = true
        } 
    }
    //flycatcher
    if(this.rare==false) {
        let maxSnake = 100000
        let snakeChance = 323 + 323*(this.magic*0.01)
        while(snakeChance % 1 !=0){
            snakeChance *= 10
            maxSnake *= 10
        }
        let dropSnake = getRandomIntInclusive(1, maxSnake)
        if(dropSnake<=snakeChance) {
            this.drops.fly = 1
            this.sell += 500000
            this.rare = true
        } 
    }
    //dig mosq
    if(this.rare==false) {
        let maxSnake = 13000
        let snakeChance = 7 + 7*(this.magic*0.01)
        while(snakeChance % 1 !=0){
            snakeChance *= 10
            maxSnake *= 10
        }
        let dropSnake = getRandomIntInclusive(1, maxSnake)
        if(dropSnake<=snakeChance) {
            this.drops.digmosq = 1
            this.sell += 1300000
            this.rare = true
        } 
    }
    }
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
module.exports = class rev {
    constructor(magic) {
        this.magic = parseInt(magic)
        this.rare = false
      this.drops = {
        flesh: 0,
        foul: 0,
        pest: 0,
        smite: 0,
        undead: 0,
        revCata: 0,
        snake: 0,
        horror: 0,
        scythe: 0
      }
      this.sell = 0 
    }
    getDrops() {
      //rev flesh
        this.drops.flesh = getRandomIntInclusive(50, 64)
        this.sell += this.drops.flesh * 2
      //foul flesh
        let maxFoul = 5
        let foulChance = 1 + 1*(parseInt(this.magic*0.01))
        while(foulChance % 1 != 0) {
            foulChance = foulChance*10
            maxFoul = maxFoul * 10
        }
        let dropFoul=getRandomIntInclusive(1, maxFoul)
        if(dropFoul<=foulChance) {
        this.drops.foul = getRandomIntInclusive(2, 3)
        this.sell += this.drops.foul * 25000
    }
    //pest. rune
    let maxPest = 20
    let pestChance = 1 + 1*(this.magic*0.01)
    while(pestChance % 1 !=0) {
      pestChance *= 10
      maxPest *=10
    }
    let dropPest=getRandomIntInclusive(1, maxPest)
    if(dropPest<=pestChance&&this.drops.foul==0) {
      this.drops.pest = 1
    }
    //undead cata
    if(this.rare==false) {
    let maxUndead = 100
    let undeadChance = 1 + 1*(this.magic*0.01)
    while(undeadChance % 1 !=0) {
      undeadChance *= 10
      maxUndead *= 10
    }
    let dropUndead = getRandomIntInclusive(1, maxUndead)
    if(dropUndead<=undeadChance) {
      this.drops.undead = 1
      this.sell += 10000
      this.rare=true
    }}
    //smite VI
    if(this.rare==false) {
      let maxSmite = 100
      let smiteChance = 1 + 1*(this.magic*0.01)
      while(smiteChance % 1 != 0) {
        smiteChance *= 10
        maxSmite *= 10
      }
      let dropSmite = getRandomIntInclusive(1, maxSmite)
      if(dropSmite<=smiteChance) {
        this.drops.smite = 1
        this.sell += 10000
        this.rare = true
      }
    }
    //rev catalyst
    if(this.rare==false) {
        let maxRev = 100
        let revChance = 1 + 1*(this.magic*0.01)
        while(revChance % 1 !=0){
            revChance *= 10
            maxRev *= 10
        }
        let dropRev = getRandomIntInclusive(1, maxRev)
        if(dropRev<=revChance) {
            this.drops.revCata = 1
            this.rare = true
        }
    }
    //beheaded horror
    if(this.rare==false) {
        let maxHorror = 1000000
        let horrorChance = 1615 + 1615*(this.magic*0.01)
        while(horrorChance % 1 !=0){
            horrorChance *= 10
            maxHorror *= 10
        }
        let dropHorror = getRandomIntInclusive(1, maxHorror)
        if(dropHorror<=horrorChance) {
            this.drops.horror = 1
            this.sell += 150000
            this.rare = true
        } 
    }
    //snake rune
    if(this.rare==false) {
        let maxSnake = 100000
        let snakeChance = 323 + 323*(this.magic*0.01)
        while(snakeChance % 1 !=0){
            snakeChance *= 10
            maxSnake *= 10
        }
        let dropSnake = getRandomIntInclusive(1, maxSnake)
        if(dropSnake<=snakeChance) {
            this.drops.snake = 1
            this.rare = true
        }
    }
    //scythe blade
    if(this.rare==false) {
        let maxSnake = 13000
        let snakeChance = 7 + 7*(this.magic*0.01)
        while(snakeChance % 1 !=0){
            snakeChance *= 10
            maxSnake *= 10
        }
        let dropSnake = getRandomIntInclusive(1, maxSnake)
        if(dropSnake<=snakeChance) {
            this.drops.scythe = 1
            this.sell += 7000000
            this.rare = true
        } 
    }
    }
}
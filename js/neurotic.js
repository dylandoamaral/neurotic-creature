/*
 * File Created: Monday, 22nd October 2018 10:22:15 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Neurotic {
    constructor(options = {}) {
        this.options = Object.assign({}, {
            phenotypePerGeneration: 100,
            boardSize: [500, 500],
            timePerGeneration: 15000,
            timePerFood: 50
        }, options);

        this.lastUpdate = Date.now();
        this.generationTime = timePerGeneration;
        this.generationTimeCurr = 0;

        this.foods = [];
        this.spawnFoodTimeCurr = 0;
        this.spawnFoodTime = timePerFood;

        this.board = new Board(boardSize[0], boardSize[1]);
        boardInformations = Object.assign({}, {
            foods: this.foods
        }, boardInformations);

        this.creatures = [];
        for(let i = 0; i < this.options.phenotypePerGeneration; i++){
            this.creatures = [...this.creatures, new Creature()];
        }
        
        window.setInterval(() => {
            this.tick() 
        } , 10);
    }

    nextGeneration(){
        let nextCreatures = [];
        this.foods = [];

        this.creatures = this.creatures.filter(c => c.score > 0)
        
        console.log(`Total score : ${this.creatures.reduce((total, creature) => total + creature.score, 0)}`);

        this.creatures.sort((a, b) =>
            a.score - b.score); // Baddest to Best

        console.log(this.creatures);

        for (let i = 0; i < 9 * this.options.phenotypePerGeneration / 10; i++) {
            nextCreatures = [...nextCreatures, this.makeChildren()]
        }
        for (let i = 9 * this.options.phenotypePerGeneration / 10; i < this.options.phenotypePerGeneration; i++) {
            let creature = new Creature();
            nextCreatures = [...nextCreatures, creature]
        }

        this.creatures = nextCreatures;
        this.board.increment();
    }

    makeChildren() {
        let father = this.rankSelection();
        if(!father)return new Creature(); // Case where nobody is selected
        let mother = this.rankSelection();
        let children = new Creature();

        children.inherite(father, mother)
        return children;
    }

    rankSelection() {
        var total = 0;
        for (let i = 0; i < this.creatures.length; i++) total += i * i;
        var rand = randBtw(0, total)
        total = 0
        for (let i = 0; i < this.creatures.length; i++) {
            total += i * i;
            if (rand <= total) {
                return this.creatures[i];
            }
        }
    }

    tick() {
        let now = Date.now();
        let dt = now - this.lastUpdate;
        this.lastUpdate = now;

        this.update(dt);
        this.draw(dt);
    }

    update(dt) {
        this.spawnFoodTimeCurr += dt;
        this.generationTimeCurr += dt;

        if(this.generationTimeCurr > this.generationTime || this.everybodyIsDead()){
            this.nextGeneration();
            this.generationTimeCurr = 0;
        }

        if(this.spawnFoodTimeCurr > this.spawnFoodTime){
            this.foods = [...this.foods, new Food()];

            boardInformations = Object.assign({}, boardInformations, {
                foods: this.foods
            });
            this.spawnFoodTimeCurr = 0;
        }

        for(let creature of this.creatures){
            creature.update(dt);
        }

        this.eat(dt);
    }

    eat(dt){
        for(var creature of this.creatures){
            for(var food of this.foods){
                let distance = Math.sqrt(Math.pow(creature.x - food.x, 2) + Math.pow(creature.y - food.y, 2));
                if(distance < creature.r){
                    creature.score++;
                    this.foods.splice(this.foods.indexOf(food), 1);
                }
            }
        }
    }

    draw(dt){
        this.board.clear();

        for(let food of this.foods){
            food.draw(this.board.context);
        }
        for(let creature of this.creatures){
            creature.draw(this.board.context);
        }

        this.board.draw();
    }

    everybodyIsDead(){
        for(let creature of this.creatures){
            if(!creature.isDead) return false;
        }
        return true;
    }
}

new Neurotic();

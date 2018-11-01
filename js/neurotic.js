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
            arenaSize: [500, 500],
            timePerGeneration: 15000,
            foodInArena: 50
        }, options);

        /*Neurotic initialisation*/
        this.generationTime = this.options.timePerGeneration;
        this.generationTimeCurr = 0;

        /*Arena initialisation*/
        this.arena = new Arena(this.options.arenaSize[0], this.options.arenaSize[1]);

        document.querySelector('.board-start').addEventListener('click', (event) => {
            event.preventDefault();
            this.pause = false;
        });

        document.querySelector('.board-stop').addEventListener('click', (event) => {
            event.preventDefault();
            this.pause = true;
        });

        document.querySelector('.board-reset').addEventListener('click', (event) => {
            event.preventDefault();
            this.reset();
        });

        /*Test initialisation*/
        this.tester = new Tester(300, 300);

        /*Food initialisation*/
        this.fillFood();

        /*Creatures initialisation*/
        this.creatures = [];
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            this.creatures = [...this.creatures, new Creature()];
        }

        /*Network Graphic initialisation*/
        this.bestCreature = this.creatures[0];
        this.networkGraphic = new NetworkGraphic(400, 150, this.bestCreature.brain);
        
        this.lastUpdate = Date.now();
        window.setInterval(() => {
            this.tick()
        }, 10);
    }

    reset() {
        this.generationTime = this.options.timePerGeneration;
        this.generationTimeCurr = 0;

        this.fillFood();

        this.creatures = [];
        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            this.creatures = [...this.creatures, new Creature()];
        }

        this.arena.reset();

        this.newBestCreature(this.creatures[0]);
    }

    fillFood() {
        this.foods = [];
        for (let i = 0; i < this.options.foodInArena; i++) {
            this.foods = [...this.foods, new Food()];
        }

        arenaInformations = Object.assign({}, {
            foods: this.foods
        }, arenaInformations);
    }

    newBestCreature(creature) {
        this.bestCreature = creature;
        this.networkGraphic.setup(creature.brain);
        document.querySelector(".creature-score").innerHTML = `Score : ${creature.score}`;
        document.querySelector(".creature-generation").innerHTML = `Generation : ${this.arena.generationNumber}`;
    }

    nextGeneration() {
        let nextCreatures = [];

        this.fillFood();

        this.creatures = this.creatures.filter(c => c.score > 0)

        console.log(`Total score : ${this.creatures.reduce((total, creature) => total + creature.score, 0)}`);
        console.log(this.creatures);

        this.creatures.sort((a, b) =>
            b.score - a.score); // Best to Baddest

        if(this.creatures.length > 0 && this.creatures[0].score >= this.bestCreature.score){
            this.newBestCreature(this.creatures[0]);
        }

        let selected = (this.creatures.length < 3 * this.options.phenotypePerGeneration / 4) ? this.creatures.length : 3 * this.options.phenotypePerGeneration / 4;
        for (let i = 0; i < selected; i++) {
            let children = new Creature();
            children.inherite(this.creatures[i], this.creatures[i]);
            nextCreatures = [...nextCreatures, children];
        }
        for (let i = selected; i < this.options.phenotypePerGeneration; i++) {
            let creature = new Creature();
            nextCreatures = [...nextCreatures, creature]
        }

        this.creatures = nextCreatures;
        this.arena.increment();
    }

    makeChildren() {
        let father = this.rankSelection();
        let children = new Creature();

        if (father){
            children.inherite(father, father)
        }
        return children;
    }

    rankSelection() {
        var total = 0;
        for (let i = 0; i < this.creatures.length; i++) total += Math.pow(i, 3);
        var rand = randBtw(0, total)
        total = 0
        for (let i = 0; i < this.creatures.length; i++) {
            total += Math.pow(i, 3);
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
        if(this.pause) return;
        this.generationTimeCurr += dt;

        if (this.generationTimeCurr > this.generationTime) {
            this.generationTimeCurr = 0;
            this.nextGeneration();
        }

        for (let creature of this.creatures) {
            creature.update(dt);
        }

        this.eat(dt);
    }

    eat(dt) {
        for (var creature of this.creatures) {
            for (var food of this.foods) {
                let distance = Math.sqrt(Math.pow(creature.x - food.x, 2) + Math.pow(creature.y - food.y, 2));
                if (distance < creature.r) {
                    creature.score++;
                    food.move();
                }
            }
        }
    }

    draw(dt) {
        this.arena.clear();

        for (let food of this.foods) {
            food.draw(this.arena.context);
        }
        for (let creature of this.creatures) {
            creature.draw(this.arena.context);
        }
        
        /**
        this.tester.clear();

        this.tester.draw();
         */
    }
}

new Neurotic({
    phenotypePerGeneration: 40,
    arenaSize: [400, 400],
    timePerGeneration: 8000,
    foodInArena: 20
});

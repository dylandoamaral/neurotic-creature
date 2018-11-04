/*
 * File Created: Monday, 22nd October 2018 10:22:15 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Neurotic {
    constructor(options = {}) {
        this.options = Object.assign({}, {
            network: {
                mutationWeightRatio: 0.1,
                mutationWeightRandomRatio: 0.1,
                mutationNodeRatio: 0.03,
                mutationConnectionRatio: 0.05,
                disableRatio: 0.75,
                distanceFactor: [1.0, 1.0, 0.4]
            },
            species: {
                countDisparition: 10,
                cleanseRatio: 0.35,
                randomRatio: 0.5,
                distanceTreshold: 3
            },
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

        /*Food initialisation*/
        this.fillFood();

        /*Creatures initialisation*/
        this.creatures = []; // networks without species
        this.species = [];

        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            let creature = new Creature(this.options.network);
            creature.brain.mutation();
            this.creatures = [...this.creatures, creature];
        }

        /*Network Graphic initialisation*/
        this.networkGraphic = new NetworkGraphic(document.querySelector('.analyser-network'), this.creatures[0].brain);
        this.creatures[0].chosen = true;
        
        this.divideInSpecies();

        this.lastUpdate = Date.now();
        window.setInterval(() => {
            this.tick()
        }, 10);
    }

    divideInSpecies() {
        for (const creature of this.creatures) {
            let added = false;
            for (const species of this.species) {
                if (creature.brain.distance(species.nominee.brain) < this.options.species.distanceTreshold) {
                    species.creatures = [...species.creatures, creature];
                    added = true;
                    break;
                }
            }
            if (added == false) this.species = [...this.species, new Species(creature)];
        }
    }

    reset() {
        this.generationTime = this.options.timePerGeneration;
        this.generationTimeCurr = 0;

        this.fillFood();

        this.creatures = []; // networks without species
        this.species = [];

        for (let i = 0; i < this.options.phenotypePerGeneration; i++) {
            let creature = new Creature(this.options.network);
            creature.brain.mutation();
            this.creatures = [...this.creatures, creature];
        }
        this.creatures[0].chosen = true;

        this.divideInSpecies();

        this.arena.reset();
    }

    fillFood() {
        this.foods = [];
        for (let i = 0; i < this.options.foodInArena; i++) {
            this.foods = [...this.foods, new Food()];
        }

        arenaInformations = Object.assign({}, arenaInformations, {
            foods: this.foods
        });
    }

    nextGeneration() {
        let survivor = 0;
        this.creatures = [];

        this.fillFood();

        for (const species of this.species) {
            survivor += species.cleanse(this.options.species.cleanseRatio);
            if (species.count > this.options.species.countDisparition) {
                this.species.splice(this.species.indexOf(species), 1);
                survivor--;
            }
        }
        for (let i = survivor; i < (1 - this.options.species.randomRatio) * this.options.phenotypePerGeneration; i++) {
            let creature = this.child();
            creature.brain.mutation();
            this.creatures = [...this.creatures, creature];
        }
        for (let i = (1 - this.options.species.randomRatio) * this.options.phenotypePerGeneration; i < this.options.phenotypePerGeneration; i++) {
            let creature = new Creature(this.options.network);
            creature.brain.mutation();
            this.creatures = [...this.creatures, creature];
        }

        this.divideInSpecies();
        this.networkGraphic.assign(this.findBest().brain);
        
        this.arena.increment();
    }

    child() {
        let species = this.speciesSelection();
        let father = this.selection(species);
        let mother = this.selection(species);
        let child = null;

        if (father.brain.fitness < mother.brain.fitness) child = mother.child(father);
        else child = father.child(mother);

        return child;
    }

    selection(species) {
        let tmpCreatures = [];

        for (const creature of species.creatures) {
            for (let i = 0; i < creature.brain.fitness; i++) {
                tmpCreatures = [...tmpCreatures, creature];
            }
        }

        return tmpCreatures[randInt(tmpCreatures.length)];
    }

    speciesSelection() {
        let tmpSpecies = [];

        for (const species of this.species) {
            for (let i = 0; i < species.creatures.length; i++) {
                tmpSpecies = [...tmpSpecies, species];
            }
        }

        return tmpSpecies[randInt(tmpSpecies.length)];
    }

    findBest(){
        let alpha = null;
        for (const species of this.species) {
            for (const creature of species.creatures) {
                if(creature.previousFitness){
                    if(!alpha || creature.previousFitness > alpha.previousFitness) alpha = creature;
                }
            }
        }
        alpha.chosen = true;
        return alpha;
    }

    tick() {
        let now = Date.now();
        let dt = now - this.lastUpdate;
        this.lastUpdate = now;

        this.update(dt);
        this.draw(dt);
    }

    update(dt) {
        if (this.pause) return;
        this.generationTimeCurr += dt;

        if (this.generationTimeCurr > this.generationTime || this.everybodyIsDead()) {
            this.generationTimeCurr = 0;
            this.nextGeneration();
        }

        for (const species of this.species) {
            for (const creature of species.creatures) {
                creature.update(dt);
            }
        }

        this.eat(dt);
    }

    eat(dt) {
        for (const species of this.species) {
            for (const creature of species.creatures) {
                for (const food of this.foods) {
                    let distance = Math.sqrt(Math.pow(creature.position.x - food.position.x, 2) + Math.pow(creature.position.y - food.position.y, 2));
                    if (distance < creature.r) {
                        creature.feed();
                        food.move();
                    }
                }
            }
        }
    }

    everybodyIsDead() {
        for (const species of this.species) {
            for (const creature of species.creatures) {
                if (creature.isDead == false) return false;
            }
        }
        return true;
    }

    draw(dt) {
        this.arena.clear();

        for (let food of this.foods) {
            food.draw(this.arena.context);
        }
        for (const species of this.species) {
            for (const creature of species.creatures) {
                creature.draw(this.arena.context);
            }
        }

        this.networkGraphic.draw();
    }
}

neurotic = new Neurotic({
    network: {
        mutationWeightRatio: 0.5,
        mutationWeightRandomRatio: 0.1,
        mutationNodeRatio: 0.03,
        mutationConnectionRatio: 0.05,
        disableRatio: 0.75,
        distanceFactor: [1.0, 1.0, 0.4]
    },
    species: {
        countDisparition: 10,
        cleanseRatio: 0.35,
        randomRatio: 0.05,
        distanceTreshold: 3
    },
    phenotypePerGeneration: 60,
    arenaSize: [550, 550],
    timePerGeneration: 20000,
    foodInArena: 30
});

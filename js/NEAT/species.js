/*
 * File Created: Thursday, 1st November 2018 10:16:20 am
 * Author: Dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - Dylan DO AMARAL
 */

class Species {
    constructor(nominee) {
        this.count = 0;
        this.nominee = nominee;
        this.creatures = [];
        this.creatures = [...this.creatures, nominee];
    }

    cleanse(ratio) {
        let alive = Math.round(ratio * this.creatures.length);

        if (alive > 0) {
            this.creatures.sort((a, b) => {
                return b.brain.fitness - a.brain.fitness;
            }); 

            this.nominee = this.creatures[0];
            this.creatures.splice(alive, this.creatures.length - alive);
        }
        if (alive == 1) this.count++;

        for (let creature of this.creatures) {
            creature.reset();
            creature.brain.mutation();
        }
        
        return alive;
    }
}
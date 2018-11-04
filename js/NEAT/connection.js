/*
 * File Created: Monday, 29th October 2018 8:27:10 am
 * Author: Dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - Dylan DO AMARAL
 */

class Connection {
    constructor(fromID, toID, innovation, weight = randBtwFloat(-2, 2)) {
        this.fromID = fromID;
        this.toID = toID;
        this.weight = weight;
        this.innovation = innovation;
        this.disable = false;
    }

    weightRandom(){
        this.weight = randBtwFloat(-2, 2);
    }

    /**
     * Perturbe the weight by more or less 1 to 10%
     */
    weightPerturbation(){
        let signe = 1;
        if(randInt(2) == 0) signe = -1;
        this.weight += signe * (this.weight / 100) * randBtwInt(1, 11); 
    }

    copy(){
        let connection = new Connection(this.fromID, this.toID, this.innovation, this.weight);
        connection.disable = this.disable;
        return connection;
    }
}
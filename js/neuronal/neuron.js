/*
 * File Created: Tuesday, 23rd October 2018 11:30:23 am
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Neuron {
    constructor() {
        this.biases = randBtwFloat(-1, 1);
        this.value = 0;

        this.links = [];
    }

    inherite(father, mother) {
        if(randBtw(0, 1000) != 0){
            if(randBtw(0, 2) == 0) this.biases = father.biases;
            else this.biases = mother.biases;
        }


        let i = 0;
        for(let link of this.links){
            if(randBtw(0, 1000) != 0){
                if(randBtw(0, 2) == 0) link.weight = father.weights[i];
                else link.weight = mother.weights[i];
            }
            i++;
        }
    }

    link(layer) {
        let neurons = layer.neurons;
        for (let neuron of neurons) {
            let link = new Link(neuron, this, randBtwFloat(-50, 50));
            this.links = [...this.links, link];
        }
    }

    activate() {
        var sum = this.biases;
        for (let link of this.links) {
            sum += link.weight * link.from.value;
        }
        this.value = logistic_function(sum);
    }

    serialize(){
        let weightinformations = [];
        for(let link of this.links){
            weightinformations = [...weightinformations, link.weight];
        }
        
        return {
            biases: this.biases,
            weights : weightinformations
        };
    }
}
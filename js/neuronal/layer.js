/*
 * File Created: Tuesday, 23rd October 2018 11:29:56 am
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Layer {
    constructor(size) {
        this.size = size;
        this.neurons = [];

        for (let i = 0; i < size; i++) {
            let neuron = new Neuron();
            this.neurons = [...this.neurons, neuron];
        }

        this.previousLayer = null;
        this.nextLayer = null;
    }

    inherite(parent) {
        let i = 0;
        for(let neuron of this.neurons){
            neuron.inherite(parent.neurons[i]);
            i++;
        }
    }

    link(layer) {
        this.nextLayer = layer;
        layer.previousLayer = this;

        for (let neuron of layer.neurons) {
            neuron.link(this);
        }
    }

    activate(callback = null) {
        for(let neuron of this.neurons){
            neuron.activate();
        }
    }

    getIlluminate(){
        var n = null;
        for(let neuron of this.neurons){
            if(!n) n = neuron;
            else{
                if(neuron.value > n.value) n = neuron;
            }
        }
        return n;
    }

    serialize(){
        let neuronInformations = [];
        for(let neuron of this.neurons){
            neuronInformations = [...neuronInformations, neuron.serialize()];
        }

        return {
            neurons: neuronInformations
        };
    }
}
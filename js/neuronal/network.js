/*
 * File Created: Tuesday, 23rd October 2018 11:27:43 am
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class NeuronalNetwork {
    constructor(input, hidden, output) {
        this.input = input;
        this.hidden = hidden;
        this.hiddenLength = hidden.length;
        this.output = output;

        this.setup();
    }

    inherite(parent, mother) {
        let parentInformations = parent.serialize();

        this.setup();

        this.layers.input.inherite(parentInformations.layers[0]);
        for (let i = 0; i < this.hiddenLength; i++) {
            this.layers.hidden[i].inherite(parentInformations.layers[i + 1]);
        }
        this.layers.output.inherite(parentInformations.layers[parentInformations.layers.length - 1]);
    }

    setup() {

        var hidden = [];
        for (let i = 0; i < this.hiddenLength; i++) {
            hidden = [...hidden, new Layer(this.hidden[i])]
        }
        this.layers = {
            input: new Layer(this.input),
            hidden: hidden,
            output: new Layer(this.output)
        }

        this.layers.input.link(this.layers.hidden[0]);
        for (let i = 1; i < this.hiddenLength; i++) {
            this.layers.hidden[i - 1].link(this.layers.hidden[i]);
        }
        this.layers.hidden[this.hiddenLength - 1].link(this.layers.output);
    }

    predict(inputs) {
        let i = 0;

        for (let neuron of this.layers.input.neurons) {
            neuron.value = inputs[i];
            i++;
        }

        for (let i = 0; i < this.hiddenLength; i++) {
            this.layers.hidden[i].activate();
        }
        this.layers.output.activate();

        return this.layers.output.neurons.indexOf(this.layers.output.getIlluminate());
    }

    serialize() {
        var layers = [];
        layers = [...layers, this.layers.input.serialize()]
        for (let i = 0; i < this.hiddenLength; i++) {
            layers = [...layers, this.layers.hidden[i].serialize()]
        }
        layers = [...layers, this.layers.output.serialize()]

        var informations = {
            layers: layers
        };

        return informations;
    }
}
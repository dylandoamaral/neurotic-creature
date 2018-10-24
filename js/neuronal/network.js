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

    inherite(father, mother) {
        let fatherInformations = father.serialize();
        let motherInformations = mother.serialize();

        this.setup();

        this.layers.input.inherite(fatherInformations.input, motherInformations.input);
        for (let i = 0; i < this.hiddenLength; i++) {
            this.layers.hidden[i].inherite(fatherInformations.hidden[i], motherInformations.hidden[i]);
        }
        this.layers.output.inherite(fatherInformations.output, motherInformations.output);
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
            i++
        }

        for (let i = 0; i < this.hiddenLength; i++) {
            this.layers.hidden[i].activate()
        }
        this.layers.output.activate();

        return this.layers.output.neurons.indexOf(this.layers.output.getIlluminate());
    }

    serialize() {
        var hidden = []
        for (let i = 0; i < this.hiddenLength; i++) {
            hidden = [...hidden, this.layers.hidden[i].serialize()]
        }

        var informations = {
            input: this.layers.input.serialize(),
            hidden: hidden,
            output: this.layers.output.serialize()
        };

        return informations;
    }
}
/*
 * File Created: Saturday, 27th October 2018 9:08:25 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class LayerGraphic {
    constructor(network, id, context, x) {
        this.network = network;
        this.layer = this.network.layers[id];

        this.id = id;
        this.context = context;
        this.x = x;

        this.neuronGraphics = [];

        let size = (this.context.canvas.clientHeight / this.layer.neurons.length) / 3.7;
        for (let i = 0; i < this.layer.neurons.length; i++) {
            this.neuronGraphics = [...this.neuronGraphics, new NeuronGraphic(this.network, id, i, this.context, this.x,
                this.yNeuron(i, id), size)];
        }
    }

    draw() {
        for (let i = 0; i < this.neuronGraphics.length; i++) {
            this.neuronGraphics[i].draw();
        }
    }

    yNeuron(neuronId, layerId) {
        return 20 + neuronId * (this.context.canvas.clientHeight - 40) / (this.network.layers[layerId].neurons.length - 1);
    }
}
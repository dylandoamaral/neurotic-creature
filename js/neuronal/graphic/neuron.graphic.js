/*
 * File Created: Saturday, 27th October 2018 9:08:33 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class NeuronGraphic {
    constructor(network, layerId, id, context, x, y, size) {
        this.network = network;
        this.neuron = this.network.layers[layerId].neurons[id];

        this.id = id;
        this.layerId = layerId;

        this.context = context;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.context.fillStyle = 'black';
        this.context.fill();
        this.drawConnections();
    }

    drawConnections() {
        for (let i = 0; i < this.neuron.weights.length; i++) {
            this.drawConnection(
                this.xLayer(this.layerId - 1), this.yNeuron(i, this.layerId - 1),
                this.xLayer(this.layerId), this.yNeuron(this.id, this.layerId),
                this.neuron.weights[i]
            );
        }
    }

    drawConnection(fromX, fromY, toX, toY, weight) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        if (weight < 0) this.context.strokeStyle = "#FF0000";
        else this.context.strokeStyle = "#0000FF";
        this.context.lineWidth = Math.abs(weight / 2);
        this.context.stroke();
    }

    xLayer(layerId) {
        return 20 + layerId * (this.context.canvas.clientWidth - 40) / (this.network.layers.length - 1);
    }

    yNeuron(neuronId, layerId) {
        return 20 + neuronId * (this.context.canvas.clientHeight - 40) / (this.network.layers[layerId].neurons.length - 1);
    }
}
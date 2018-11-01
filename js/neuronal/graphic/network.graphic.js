/*
 * File Created: Saturday, 27th October 2018 7:13:34 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class NetworkGraphic {
    constructor(width, height, network) {
        this.width = width;
        this.height = height;

        this.network = network.serialize();

        this.canvas = document.querySelector('.creature-network');
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.canvas.getContext("2d");
        this.context.rect(0, 0, this.width, this.height);

        this.setup(network);
    }

    setup(network) {
        this.network = network.serialize();

        this.layerGraphics = [];

        for (let i = 0; i < this.network.layers.length; i++) {
            this.layerGraphics = [...this.layerGraphics, new LayerGraphic(this.network, i, this.context, this.xLayer(i))];
        }

        this.context.clearRect(0, 0, this.width, this.height);
        this.draw();
    }

    draw() {
        for (let i = 0; i < this.layerGraphics.length; i++) {
            this.layerGraphics[i].draw();
        }
    }

    xLayer(layerId) {
        return 20 + layerId * (this.context.canvas.clientWidth - 40) / (this.network.layers.length - 1);
    }
}
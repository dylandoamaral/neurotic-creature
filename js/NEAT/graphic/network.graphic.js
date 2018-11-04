/*
 * File Created: Friday, 2nd November 2018 9:58:44 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class NetworkGraphic {
    constructor(canvas, network) {
        this.width = 400;
        this.height = 150;

        this.canvas = canvas;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.context = this.canvas.getContext("2d");

        this.assign(network);
    }

    assign(network) {
        this.network = network;

        this.graphicNodes = new Map();
        this.graphicConnections = [];

        this.input = this.network.input;
        let currInput = 0;
        this.output = this.network.output;
        let currOutput = 0;


        for (const node of this.network.nodes) {
            switch (node.type) {
                case TYPE.INPUT:
                    this.graphicNodes.set(node.id, new NodeGraphic(node, 10, (currInput + 1) * (this.height / (this.input + 1)), 7));
                    currInput++;
                    break;
                case TYPE.HIDDEN:
                    this.graphicNodes.set(node.id, new NodeGraphic(node, randBtwInt(30, this.width - 30), randBtwInt(20, this.height - 20), 7));
                    break;
                default:
                    this.graphicNodes.set(node.id, new NodeGraphic(node, this.width - 10, (currOutput + 1) * (this.height / (this.output + 1)), 7));
                    currOutput++;
            }
        }


        for (const connection of this.network.connections) {
            this.graphicConnections = [...this.graphicConnections, new ConnectionGraphic(connection, this.graphicNodes.get(connection.fromID), this.graphicNodes.get(connection.toID))];
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height);

        for (const connection of this.graphicConnections) {
            connection.draw(this.context);
        }

        for (const node of this.graphicNodes.values()) {
            node.draw(this.context);
        }
    }
}
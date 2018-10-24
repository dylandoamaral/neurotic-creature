/*
 * File Created: Monday, 22nd October 2018 10:24:10 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

var boardInformations;

class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        
        this.generationNumber = 0;
        
        boardInformations = Object.assign({}, {
            width: width,
            height: height
        }, boardInformations);

        this.setup();
    }

    setup() {
        this.container = document.getElementById('neurotic');

        // Creation of the canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.context = this.canvas.getContext("2d");

        this.container.appendChild(this.canvas);

        // Creation of the generation number
        this.generation = document.createElement('p');
        this.generation.innerHTML = "generation 0";

        this.container.appendChild(this.generation);
    }

    increment() {
        this.generationNumber++;
        this.generation.innerHTML = `generation ${this.generationNumber}`;
    }

    draw(){

        this.context.rect(0, 0, this.width, this.height);
        this.context.stroke();
    }

    clear(){
        this.context.clearRect(0, 0, this.width, this.height);
    }
}
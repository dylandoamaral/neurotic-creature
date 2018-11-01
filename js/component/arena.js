/*
 * File Created: Monday, 22nd October 2018 10:24:10 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

var arenaInformations;

class Arena {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        
        this.generationNumber = 0;
        
        arenaInformations = Object.assign({}, {
                width: width,
                height: height,
                context: null
        }, arenaInformations);

        this.setup();
    }

    setup() {
        this.canvas = document.querySelector('.board-arena');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.context = this.canvas.getContext("2d");
        
        this.generation = document.querySelector('.board-generation');
        this.generation.innerHTML = "generation 0";

    }

    reset() {
        this.clear();
        this.generationNumber = 0;
        this.generation.innerHTML = `generation ${this.generationNumber}`;
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
        this.draw();
    }
}
/*
 * File Created: Saturday, 27th October 2018 7:08:14 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Tester {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        
        this.setup();
    }

    setup() {
        this.canvas = document.querySelector('.creature-arena');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.context = this.canvas.getContext("2d");
    }

    reset() {
        this.clear();
    }

    draw(){
        this.context.rect(0, 0, this.width, this.height);
        this.context.stroke();
    }

    clear(){
        this.context.clearRect(0, 0, this.width, this.height);
    }
}

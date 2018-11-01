/*
 * File Created: Monday, 22nd October 2018 11:46:39 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Food {
    constructor() {
        this.move();
    }

    draw(context) {
        // Round form
        context.beginPath();
        context.arc(this.x, this.y, 4, 0, 2 * Math.PI);
        context.fillStyle = 'rgb(100, 120, 210)';
        context.fill();
    }

    move(){
        this.x = randBtw(10, arenaInformations.width - 10);
        this.y = randBtw(10, arenaInformations.height - 10);
    }
}
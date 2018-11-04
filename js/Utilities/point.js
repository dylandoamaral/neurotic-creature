/*
 * File Created: Saturday, 3rd November 2018 10:36:25 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(point) {
        this.x += point.x;
        this.y += point.y
    }

    multiply(point) {
        this.x *= point.x;
        this.y *= point.y;
    }
    distance(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
}
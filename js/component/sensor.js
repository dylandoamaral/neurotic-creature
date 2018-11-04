/*
 * File Created: Saturday, 3rd November 2018 10:19:20 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Sensor {
    constructor(origin, distance, angle) {
        this.distance = distance;
        this.angle = angle;

        this.origin = origin;
        this.destination = new Point(this.origin.x + this.distance, this.origin.y);
        this.rotate(this.angle);

        this.value = 0;
    }

    rotate(angle){
        let sin = Math.sin(angle * degToRad());
        let cos = Math.cos(angle * degToRad());

        this.destination.x -= this.origin.x;
        this.destination.y -= this.origin.y;

        let x = this.destination.x * cos - this.destination.y * sin;
        let y = this.destination.x * sin + this.destination.y * cos;

        this.destination.x = x + this.origin.x;
        this.destination.y = y + this.origin.y;
    }

    forward(origin, angle){
        this.origin = origin;
        this.destination = new Point(this.origin.x + this.distance, this.origin.y);
        this.rotate(this.angle + angle);
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.origin.x, this.origin.y);
        context.lineTo(this.destination.x, this.destination.y);
        if (this.value == 1) context.strokeStyle = "black";
        else context.strokeStyle = "#FF0000";
        context.stroke();
        context.closePath();
    }

    detect(){
        this.value = 1;
        for (const food of arenaInformations.foods) {
            let distanceOrigin = this.origin.distance(food.position);
            if(this.collision(food.position)){
                this.value = distanceOrigin / this.distance;
            }
        }
    }

    collision(point){
        let left = this.origin.distance(point) + point.distance(this.destination);
        let right = this.origin.distance(this.destination)

        if(left <= right + 2.5
            && left >= right - 2.5) return true;
        return false;
    }
}
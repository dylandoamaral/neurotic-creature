/*
 * File Created: Monday, 22nd October 2018 11:22:15 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Creature {
    constructor() {
        this.x = boardInformations.width / 2;
        this.y = boardInformations.height / 2;
        this.r = 6;

        this.speed = 1;
        this.rotation = 0;

        this.score = 0;

        this.isDead = false;

        this.brain = new NeuronalNetwork(7, [4, 4], 3);
    }

    hitWall() {
        if (this.x < this.r || this.x > boardInformations.width - this.r ||
            this.y < this.r || this.y > boardInformations.height - this.r) {
            this.isDead = true;
            this.score -= 2;
        }
    }

    distanceFood() {
        var distanceMin = 9999;
        var foodMin;

        for (var food of boardInformations.foods) {
            let distance = Math.sqrt(Math.pow(this.x - food.x, 2) + Math.pow(this.y - food.y, 2));
            if (distance < distanceMin) {
                distanceMin = distance;
                foodMin = food;
            }
        }

        if (foodMin) return [foodMin.x - this.x, foodMin.y - this.y];
        else return [9999, 9999]
    }

    distanceWalls() {
        return [
            this.x - this.r, //left
            boardInformations.width - this.x - this.r, //right
            this.y - this.r, //top
            boardInformations.height - this.y - this.r //bottom
        ];
    }

    update(dt) {
        if (this.isDead) return;

        this.forward();
        this.think();

        this.hitWall();
    }

    think() {
        var inputs = [];

        inputs = [...inputs, this.rotation % 360];
        for (let distance of this.distanceWalls()) inputs = [...inputs, distance];
        for (let foodPos of this.distanceFood()) inputs = [...inputs, foodPos];

        switch (this.brain.predict(inputs)) {
            case 0:
                //nothing
                break;
            case 1:
                this.turn(15);
                break;
            case 2:
                this.turn(-15);
                break;
            default:
                console.error("wrong output")
        };
    }

    turn(angle) {
        this.rotation += angle;
    }

    forward() {
        let vx = this.speed * Math.cos(this.rotation * degToRad());
        let vy = this.speed * Math.sin(this.rotation * degToRad());

        this.x += vx;
        this.y += vy;
    }

    inherite(father, mother) {
        this.brain.inherite(father.brain, mother.brain);
    }

    draw(context) {
        context.save();

        // Round form
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.fillStyle = 'black';
        context.fill();

        // Triangle form
        context.translate(this.x, this.y);
        context.rotate(this.rotation * Math.PI / 180);

        context.beginPath();
        context.moveTo(this.r * 2, 0);
        context.lineTo(0, this.r);
        context.lineTo(0, -this.r);
        context.fill();

        context.restore();
    }
}
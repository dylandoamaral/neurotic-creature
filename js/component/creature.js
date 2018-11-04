/*
 * File Created: Monday, 22nd October 2018 11:22:15 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class Creature {
    constructor(options) {
        this.options = options;

        this.position = new Point();
        this.position.x =  arenaInformations.width/2;
        this.position.y = arenaInformations.height/2;
        this.vx = 0;
        this.vy = 0;

        this.rotation =0;

        this.r = 6;

        this.speed = 2;


        this.isDead = false;

        this.scoreTime = 500;
        this.scoreTimeCurr = 0;

        this.maxFood = 15;
        this.food = this.maxFood;

        this.brain = new Network(5, 3, this.options);
        this.brain.fitness = 1;

        this.chosen = false;

        this.fov = 50;
        this.sensors = [];
        for (let i = 4; i >= 0; i--) {
            this.sensors = [...this.sensors, new Sensor(this.position, 80, this.fov / 2 * i - this.fov)];
        }
    }

    reset() {
        this.position.x =  arenaInformations.width/2;
        this.position.y = arenaInformations.height/2;
        this.rotation = 0;

        this.isDead = false;

        this.food = this.maxFood;
        this.scoreTimeCurr = 0;

        this.previousFitness = this.brain.fitness;
        this.brain.fitness = 1;

        this.chosen = false;

        this.sensors = [];
        for (let i = 4; i >= 0; i--) {
            this.sensors = [...this.sensors, new Sensor(this.position, 80, this.fov / 2 * i - this.fov)];
        }
    }

    hitWall() {
        /** 
        if (this.position.x < this.r || this.position.x > arenaInformations.width - this.r ||
            this.position.y < this.r || this.position.y > arenaInformations.height - this.r) {
            this.isDead = true;
        } 
        */
        if (this.position.x > arenaInformations.width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = arenaInformations.width;
        if (this.position.y > arenaInformations.height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = arenaInformations.height;

    }

    distanceFood() {
        var distanceMin = 9999;
        var foodMin;

        for (var food of arenaInformations.foods) {
            let distance = Math.sqrt(Math.pow(this.position.x - food.position.x, 2) + Math.pow(this.position.y - food.position.y, 2));
            if (distance < distanceMin) {
                distanceMin = distance;
                foodMin = food;
            }
        }

        if (foodMin) {
            return [(this.position.x - foodMin.position.x) / distanceMin, (this.position.y - foodMin.position.y) / distanceMin];
        }
        else {
            return [9999, 9999];
        }
    }

    distanceWalls() {
        return [
            (this.position.x - this.r) / arenaInformations.width, //left
            (arenaInformations.width - this.position.x - this.r) / arenaInformations.width, //right
            (this.position.y - this.r) / arenaInformations.height, //top
            (arenaInformations.height - this.position.y - this.r) / arenaInformations.height //bottom
        ];
    }

    update(dt) {
        if (this.isDead) return;

        this.scoreTimeCurr += dt;
        if (this.scoreTimeCurr > this.scoreTime) {
            this.brain.fitness++;
            this.food--;
            this.scoreTimeCurr = 0;
            if (this.food <= 0) this.isDead = true;
        }

        for (const sensor of this.sensors) {
            sensor.detect();
        }

        this.think();

        this.hitWall();
    }

    think() {
        var inputs = [];

        /**
        inputs = [...inputs, this.vx];
        inputs = [...inputs, this.vy];
        inputs = [...inputs, (this.distanceFood()[0])];
        inputs = [...inputs, (this.distanceFood()[1])];
        
        inputs = [...inputs, (this.distanceWalls()[0])];
        inputs = [...inputs, (this.distanceWalls()[1])];
        inputs = [...inputs, (this.distanceWalls()[2])];
        inputs = [...inputs, (this.distanceWalls()[3])];
        */

        for (const sensor of this.sensors) {
            inputs = [...inputs, sensor.value];
        }

        //for (let distance of this.distanceWalls()) inputs = [...inputs, distance];

        switch (this.brain.predict(inputs)) {
            case 0:
                this.turn(-15);
                break;
            case 1:
                this.forward();
                break;
            case 2:
                this.turn(15);
                break;
            default:

        };
    }

    turn(angle) {
        this.rotation += angle;
        for (const sensor of this.sensors) {
            sensor.rotate(angle);
        }
    }

    forward() {
        this.vx = Math.cos(this.rotation * degToRad());
        this.vy = Math.sin(this.rotation * degToRad());

        this.position.x += this.speed * this.vx;
        this.position.y += this.speed * this.vy;

        for (const sensor of this.sensors) {
            sensor.forward(this.position, this.rotation);
        }
    }

    child(partner) {
        let child = new Creature(this.options);
        child.brain = this.brain.child(partner.brain);
        return child;
    }

    draw(context) {
        context.save();

        // Round form
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI);
        if (!this.chosen) {
            if (!this.isDead) context.fillStyle = 'black';
            else context.fillStyle = 'rgb(240, 240, 240)';
        } else {
            if (!this.isDead) context.fillStyle = 'rgb(218,165,32)';
            else context.fillStyle = 'rgb(240, 240, 240)';
        }

        context.fill();

        if (debug) {
            for (const sensor of this.sensors) {
                sensor.draw(context);
            }
        }

        // Triangle form
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);

        context.beginPath();
        context.moveTo(this.r * 2, 0);
        context.lineTo(0, this.r);
        context.lineTo(0, -this.r);
        context.fill();

        context.restore();


    }

    feed() {
        this.food += this.maxFood / 2;
        this.brain.fitness += 20;
    }
}
/*
 * File Created: Saturday, 3rd November 2018 12:41:34 am
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class ConnectionGraphic {
    constructor(connection, from, to) {
        this.from = from;
        this.to = to;
        this.weight = connection.weight;
        this.disable = connection.disable;
    }

    draw(ctx) {
        ctx.beginPath();
        if (this.disable){
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
        }else{
            ctx.lineWidth = Math.abs(this.weight * 2);
            ctx.strokeStyle = "black";
        }
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.stroke();
        ctx.closePath();
    }
} 
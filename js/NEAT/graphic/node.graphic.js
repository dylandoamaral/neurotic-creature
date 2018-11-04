/*
 * File Created: Friday, 2nd November 2018 11:01:07 pm
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

class NodeGraphic {
    constructor(node, x, y, size) {
        this.node = node;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(ctx) {
        ctx.fillStyle = `white`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.0;

        ctx.beginPath();
        ctx.fillRect(this.x - (this.size - 2) / 2, this.y - (this.size - 2) / 2, (this.size - 2), (this.size - 2));
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.font = "9px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${this.node.value.toFixed(2)}`, this.x, this.y - 7);
        ctx.closePath();

        if (this.node.value > 0) ctx.fillStyle = `rgba(0, 0, 255, ${Math.abs(this.node.value)})`;
        else ctx.fillStyle = `rgba(255, 0, 0, ${Math.abs(this.node.value)})`;
        ctx.beginPath();
        ctx.fillRect(this.x - (this.size - 2) / 2, this.y - (this.size - 2) / 2, (this.size - 2), (this.size - 2));
        ctx.closePath();
    }
}
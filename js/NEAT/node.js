/*
 * File Created: Monday, 29th October 2018 8:27:05 am
 * Author: Dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - Dylan DO AMARAL
 */

const TYPE = {
    INPUT: "INPUT",
    HIDDEN: "HIDDEN",
    OUTPUT: "OUTPUT"
}
class Node {
    constructor(id, type, value = 0) {
        this.id = id;
        this.type = type;
        this.value = value;
    }
}

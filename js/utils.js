/*
 * File Created: Tuesday, 23rd October 2018 12:00:45 am
 * Author: dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - dylandoamaral
 */

// min <= n < max
function randBtw(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randBtwFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function degToRad() {
    return Math.PI / 180;
}

function radToDeg() {
    return 180 / Math.PI;
}

// https://en.wikipedia.org/wiki/Logistic_function
function logistic_function(x) {
    return 1 / (1 + Math.exp(-x));
}
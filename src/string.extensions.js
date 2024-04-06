"use strict";
String.prototype.isWord = function () {
    return /^\w+$/.test(this.toString());
};

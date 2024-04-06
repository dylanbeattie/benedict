"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adder_1 = __importDefault(require("./adder"));
let adder = new adder_1.default(5);
let h1 = document.querySelector("h1");
h1.innerHTML = adder.add(5).toString();

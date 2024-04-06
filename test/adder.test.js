"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adder_1 = __importDefault(require("../src/adder"));
describe('foo', () => {
    it('works', () => {
        var adder = new adder_1.default(5);
        expect(adder.add(2)).toBe(7);
    });
});

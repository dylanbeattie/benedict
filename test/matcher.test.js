"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matcher_1 = __importDefault(require("../src/matcher"));
describe('abc def ghi', () => {
    let matcher = new matcher_1.default('abc def ghi');
    let cases = [
        ['', 0],
        ['a', 1],
        ['ab', 2],
        ['abc d', 5]
    ];
    test.each(cases)('matches %p at %p', (fragment, index) => {
        expect(matcher.match(fragment)).toBe(index);
    });
});
let input = 'ABC def GHI';
describe(input, () => {
    let matcher = new matcher_1.default(input);
    let cases = [
        ['', 0],
        ['a', 1],
        ['ab', 2],
        ['abcd', 5]
    ];
    test.each(cases)('matches %p at %p', (fragment, index) => {
        expect(matcher.match(fragment)).toBe(index);
    });
});

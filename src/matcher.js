"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Matcher_text;
Object.defineProperty(exports, "__esModule", { value: true });
require("string.extensions");
class Matcher {
    constructor(text) {
        _Matcher_text.set(this, void 0);
        __classPrivateFieldSet(this, _Matcher_text, text, "f");
        let tokens = text.split(/\b/g);
        if (tokens.length == 0)
            return;
        if (!tokens[1].isWord())
            tokens.unshift('');
        if (!tokens[tokens.length - 1].isWord())
            tokens.push('');
    }
    /**
     * Return the index of the last character of the
     * sequence of formatted, punctuated text that
     * matches the supplied fragment.
     * @example
     * // returns 1
     * new Matcher('Hey, you? Can I... help?').match('He');
     * @example
     * // returns 12
     * new Matcher('Hey, you? Can I... help?').match('hey you can');
     */
    match(fragment) {
        return __classPrivateFieldGet(this, _Matcher_text, "f").indexOf(fragment) + fragment.length;
    }
}
_Matcher_text = new WeakMap();
exports.default = Matcher;

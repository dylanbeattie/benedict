import 'string.extensions';

export default class Matcher {
	#text: string;
	constructor(text: string) {
		this.#text = text;
		let tokens = text.split(/\b/g);
		if (tokens.length == 0) return;
		if (! tokens[1].isWord()) tokens.unshift('');
		if (! tokens[tokens.length-1].isWord()) tokens.push('');
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
	match(fragment: string) : number {
		return this.#text.indexOf(fragment) + fragment.length;
	}
}
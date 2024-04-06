import './strings';

export default class Matcher {
	#text: string;
	tokens: string[];
	spaces: string[];
	constructor(text: string) {
		this.#text = text;
		[ this.tokens, this.spaces ] = text.unzip();
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
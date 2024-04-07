import './strings';

export default class Matcher {
	originalText: string;
	haystack: string;
	tokens: string[];
	spaces: string[];
	constructor(text: string) {
		this.originalText = text;
		const [tokens, spaces] = text.unzip();
		this.tokens = tokens.map(t => t.toLowerCase());
		this.spaces = spaces;
		this.haystack = this.tokens.join('').trim();
	}

	/**
	 * Return the index of the last character of the
	 * sequence of formatted, punctuated text that
	 * matches the supplied fragment.
	 * @example
	 * // returns 1
	 * new Matcher('Hey, you? Can I... help?').match('HE');
	 * @example
	 * // returns 12
	 * new Matcher('Hey, you? Can I... help?').match('hey you can');
	 */
	match(fragment: string): number {
		let needle = fragment.toLowerCase().split(' ').join('').trim();
		const lastWordInFragment = (fragment.split(' ').pop() ?? '').toLowerCase();
		const position = this.haystack.indexOf(needle) + needle.length;
		let indexOfFinalSpace = this.tokens.indexOfPosition(position);
		let indexOfFinalToken = indexOfFinalSpace;
		if (this.tokens[indexOfFinalSpace-1] === lastWordInFragment) indexOfFinalToken--;
		let tokensToCount = this.tokens.slice(0, indexOfFinalToken);
		let spacesToCount = this.spaces.slice(0, indexOfFinalSpace);
		var adjustedOffset = tokensToCount.concat(spacesToCount)
			.reduce((sum, token) => sum + token.length, 0);
		var targetToken = this.tokens[indexOfFinalSpace].toLowerCase();
		console.log(lastWordInFragment, targetToken);
		if (targetToken !== lastWordInFragment) {
			if (lastWordInFragment.length > targetToken.length) {
				console.log(position, indexOfFinalToken, lastWordInFragment, targetToken);
				console.log(adjustedOffset);
				console.log(this.spaces[indexOfFinalSpace-1].length);
				return adjustedOffset + this.spaces[indexOfFinalSpace-1].length;
			}
			console.log('foo');
			return adjustedOffset + lastWordInFragment.length;
		}
		console.log('bar');
		return adjustedOffset + targetToken.length + this.spaces[indexOfFinalSpace].length;
	}
}
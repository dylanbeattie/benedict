import './strings';

export default class Matcher {
	originalText: string;
	haystack: string;
	tokens: string[];
	spaces: string[];
	constructor(text: string) {
		this.originalText = text;
		[this.tokens, this.spaces] = text.unzip();
		this.haystack = this.tokens.join('').toLowerCase().trim();
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
		const lastWordInFragment = fragment.split(' ').pop() ?? '';
		// OK,
		// Input is 'Apple... Banana? Carrot!'
		// we have tokens [ 'Apple', 'Banana', 'Carrot' ]
		// joining tokens give us 'apple banana carrot'
		// indexOf('apple banana car') gives us 0
		// 'apple banana car'.length gives 16
		const position = this.haystack.indexOf(needle) + needle.length;
		console.log(position);
		let indexOfTarget = this.tokens.indexOfPosition(position);
		console.log(needle, this.haystack, this.originalText);
		console.log(indexOfTarget);
		let tokensToCount = this.tokens.slice(0, indexOfTarget);
		let spacesToCount = this.spaces.slice(0, indexOfTarget);
		var adjustedOffset = tokensToCount.concat(spacesToCount)
			.reduce((sum, token) => sum + token.length, 0);
		var targetToken = this.tokens[indexOfTarget].toLowerCase();
		console.log(lastWordInFragment);
		console.log(targetToken);
		if (targetToken !== lastWordInFragment) return adjustedOffset + lastWordInFragment.length;
		console.log(adjustedOffset);

		return adjustedOffset + targetToken.length + this.spaces[indexOfTarget].length;
	}
}
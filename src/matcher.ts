import './strings';
import './arrays';

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
	match(fragment: string, scope: number = 0): number {
		let needle = fragment.replace(/[\W]/g, '').toLowerCase();
		let offset = 0;
		if (scope > 0) {
			offset = needle.length - (scope +1);
			needle = needle.slice(-scope);
		}
		let position = this.haystack.indexOf(needle, offset);
		if (position < 0) return position;

		position += needle.length - 1;
		let indexOfFinalSpace = this.tokens.indexOfPosition(position);
		if (indexOfFinalSpace < 0) return indexOfFinalSpace;

		const lastWordInFragment = (fragment.split(/\W+/).pop() ?? '').toLowerCase();

		let indexOfFinalToken = indexOfFinalSpace;
		if (this.tokens[indexOfFinalSpace - 1] === lastWordInFragment) indexOfFinalToken--;
		let tokensToCount = this.tokens.slice(0, indexOfFinalToken);
		let spacesToCount = this.spaces.slice(0, indexOfFinalSpace);
		
		var targetToken = this.tokens[indexOfFinalSpace].toLowerCase();

		var thingsToCount = tokensToCount.zip(spacesToCount);
		if (targetToken !== lastWordInFragment) {
			if (lastWordInFragment.length > targetToken.length) {
				thingsToCount.push(this.spaces[indexOfFinalSpace - 1]);
			} else {
				thingsToCount.push(lastWordInFragment);
			}
		} else {
			thingsToCount.push(targetToken);
			thingsToCount.push(this.spaces[indexOfFinalSpace]);
		}
		

			// if (lastWordInFragment.length > targetToken.length) {
		// 	thingsToCount.push(this.spaces[indexOfFinalSpace-1]);
		// } else if (lastWordInFragment === targetToken) {
		// 	thingsToCount.push(lastWordInFragment);
		// } else {
		// 	thingsToCount.push(targetToken);
		// 	thingsToCount.push(this.spaces[indexOfFinalSpace]);
		// }
		console.log(thingsToCount);
		return thingsToCount.reduce((length,token) => length + token.length,0);
		
		var adjustedOffset = tokensToCount.zip(spacesToCount)
			.reduce((sum, token) => sum + token.length, 0);
		if (targetToken !== lastWordInFragment) {
			if (lastWordInFragment.length > targetToken.length) {
				return adjustedOffset + this.spaces[indexOfFinalSpace - 1].length;
			}
			return adjustedOffset + lastWordInFragment.length;
		}
		return adjustedOffset + targetToken.length + this.spaces[indexOfFinalSpace].length;
	}
}
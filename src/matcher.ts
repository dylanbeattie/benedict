import './strings';
import './arrays';

export default class Matcher {
	fancyText: string = "";
	plainText: string = "";
	tokens: string[] = [];
	spaces: string[] = [];
	constructor(fancyText: string) {
		this.updateScript(fancyText);
	}

	updateScript(fancyText: string) {
		this.fancyText = fancyText.replace(/(\r?\n)(\s*\r?\n)*/g, '\n');
		const [tokens, spaces] = fancyText.unzip();
		this.tokens = tokens.map(t => t.toLowerCase());
		this.spaces = spaces;
		this.plainText = this.tokens.join('').trim();
	}

	haystack: string = "";

	findPlainIndex(needle: string, position: number, scope: number) {
		let offset = Math.max(position - scope, 0);
		let fancyPreamble = this.fancyText.substring(0, offset);
		let plainPreamble = fancyPreamble.replace(/[\W]/g, '').toLowerCase();
		let preambleLength = plainPreamble.length;
		this.haystack = this.fancyText.substring(offset, position + scope)
			.replace(/[\W]/g, '').toLowerCase();
		let found = this.haystack.indexOf(needle);
		return (found < 0 ? found : found + preambleLength);
	}

	/**
	 * Return the index of the last character of the
	 * sequence of formatted, punctuated text that
	 * matches the supplied fragment.
	 * @argument fragment - The text to find.
	 * @argument position - The index to start searching from. This refers to the position
	 * in the fancy text, not in the plain text.
	 * @argument scope - The number of characters to include when searching.
	 * @example
	 * // returns 1
	 * new Matcher('Hey, you? Can I... help?').match('HE');
	 * @example
	 * // returns 12
	 * new Matcher('Hey, you? Can I... help?').match('hey you can');
	 */


	match(speech: string, position: number, scope: number): number {
		let needle = speech.replace(/[\W]/g, '').toLowerCase();
		let found = this.findPlainIndex(needle, position, scope);
		if (found < 0) return found;

		let indexOfEndOfSpeech = found + needle.length - 1;
		let indexOfTokenContainingEndOfSpeech = this.tokens.indexOfPosition(indexOfEndOfSpeech);
		if (indexOfTokenContainingEndOfSpeech < 0) return indexOfTokenContainingEndOfSpeech;

		const lastWordInFragment = speech.lastWord().toLowerCase();

		let indexOfFinalToken = indexOfTokenContainingEndOfSpeech;
		if (this.tokens[indexOfTokenContainingEndOfSpeech - 1] === lastWordInFragment) indexOfFinalToken--;
		let tokensToCount = this.tokens.slice(0, indexOfFinalToken);
		let spacesToCount = this.spaces.slice(0, indexOfTokenContainingEndOfSpeech);

		var targetToken = this.tokens[indexOfTokenContainingEndOfSpeech].toLowerCase();

		var allTheThings = tokensToCount.zip(spacesToCount);
		if (lastWordInFragment.length > targetToken.length) {
			allTheThings.push(this.spaces[indexOfTokenContainingEndOfSpeech - 1]);
		} else {
			allTheThings.push(lastWordInFragment);
			if (lastWordInFragment === targetToken) {
				allTheThings.push(this.spaces[indexOfTokenContainingEndOfSpeech]);
			}
		}
		return allTheThings.sum(token => token.length);
	}
}
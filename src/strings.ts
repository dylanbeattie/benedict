interface String {
	isWord(): boolean;
	unzip(): [string[], string[]];
}

interface Array<T> {
	indexOfPosition(position: number): number;
}

Array.prototype.indexOfPosition = function(position: number) : number {
	let index = 0;
	let totalLength = 0;
	while (index < this.length) {
		position -= this[index].length;
		if (position < 0) return index;
		index++;
	}
	return -1;
}

String.prototype.isWord = function (): boolean {
	return /^\w+$/.test(this.toString());
}
/**
 * returns a pair of arrays. One array contains the words in this string,
 * the other contains all the non-word sequences. Zipping them back together
 * (e.g. words[0] + spaces[0] + words[1] + spaces[1] + words[2] + spaces[2])
 * will return the original string.
 */
String.prototype.unzip = function (): [string[], string[]] {
	let tokens: string[] = [];
	let spaces: string[] = [];
	if (this == null || this.length == 0) return [tokens, spaces];
	let chunks = this.split(/\b/g);
	if (!chunks[0].isWord()) chunks.unshift('');
	if (chunks.length % 2 === 1) chunks.push('');
	var i = 0;
	while (i < chunks.length) {
		tokens.push(chunks[i++]);
		spaces.push(chunks[i++]);
	}
	return [tokens, spaces];
}

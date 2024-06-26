interface String {
	lastWord(): string;
	isWord(): boolean;
	unzip(): [string[], string[]];
}

String.prototype.isWord = function (): boolean {
	return /^\w+$/.test(this.toString());
}
String.prototype.lastWord = function() : string {
	return (this.split(/\W+/).filter(t => t.length > 0).pop() ?? '');
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

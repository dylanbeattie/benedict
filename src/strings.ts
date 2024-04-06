interface String {
	isWord(): boolean;
	unzip(): [string[], string[]];
}

String.prototype.isWord = function (): boolean {
	return /^\w+$/.test(this.toString());
}

String.prototype.unzip = function (): [string[], string[]] {
	let tokens: string[] = [];
	let spaces: string[] = [];
	if (this == null || this.length == 0) return [tokens, spaces];
	let chunks = this.toLowerCase().split(/\b/g);
	if (!chunks[0].isWord()) chunks.unshift('');
	if (chunks.length % 2 === 1) chunks.push('');
	var i = 0;
	while (i < chunks.length) {
		tokens.push(chunks[i++]);
		spaces.push(chunks[i++]);
	}
	return [tokens, spaces];
}

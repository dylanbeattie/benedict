interface String {
	isWord(): boolean;
}

String.prototype.isWord = function() {
	return /^\w+$/.test(this.toString());
}
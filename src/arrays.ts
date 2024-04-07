interface Array<T> {
	indexOfPosition(position: number): number;
	zip(arr: Array<T>) : Array<T>;
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

Array.prototype.zip = function(arr: any[]) : any[] {
	let index = 0;
	let result = [];
	while(index < this.length) {
		result.push(this[index]);
		if (index < arr.length) result.push(arr[index]);
		index++;
	}
	while (index < arr.length) result.push(arr[index++]);
	return result;
}

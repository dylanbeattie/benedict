interface Array<T> {
	indexOfPosition(position: number): number;
	zip(arr: Array<T>) : Array<T>;
	sum(func : (value: T) => number) : number;
}

Array.prototype.sum = function(func: (value: any) => number) {
	return this.reduce((sum,value) => sum += func(value), 0);
}

Array.prototype.indexOfPosition = function(position: number) : number {
	for(var index = 0; index < this.length; index++) {
		position -= this[index].length;
		if (position < 0) return index;
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

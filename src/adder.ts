export default class Adder {

	#x;
	constructor(x : number) {
		this.#x = x;
	}
	add(y: number) {
		return this.#x + y;
	}
}
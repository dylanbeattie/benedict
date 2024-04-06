import Adder from '../src/adder';

describe('foo', () => {
	it('works', () => {
		var adder = new Adder(5);
		expect(adder.add(2)).toBe(7);
	});
});

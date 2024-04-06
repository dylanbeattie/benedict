import '../src/strings';

describe('unzip', () => {
	let cases = {
		'abc': [['abc'], ['']],
		'a b c': [['a', 'b', 'c'], [' ', ' ', '']],
		'a! b... c?': [['a', 'b', 'c'], ['! ', '... ', '?']],
		'...a.b.c...': [['', 'a', 'b', 'c'], ['...', '.', '.', '...']]
		'\na\rb\tc': [['', 'a', 'b', 'c'], ['\n', '\r', '\t', '']]
	};
	for (const [input, expected] of Object.entries(cases)) {
		it(input, () => {
			expect(input.unzip()).toStrictEqual(expected);
		});
	};
});

describe('indexOfPosition', () => {
	let cases: [string[], number, number][] = [
		[[], 0, -1],
		[[], 1, -1],
		[[], 2, -1],
		[['abc'], 0, 0],
		[['abc'], 1, 0],
		[['abc'], 2, 0],
		[['abc'], 3, -1],
		[['a','b','c'], 0, 0],
		[['a','b','c'], 1, 1],
		[['a','b','c'], 2, 2],
		[['ab', 'cd'], 0, 0],
		[['ab', 'cd'], 1, 0],
		[['ab', 'cd'], 2, 1],
		[['ab', 'cd'], 3, 1],
		[['ab', 'cd'], 4, -1],
		[['a', 'bcd', 'e'], 0, 0],
		[['a', 'bcd', 'e'], 1, 1],
		[['a', 'bcd', 'e'], 2, 1],
		[['a', 'bcd', 'e'], 3, 1],
		[['a', 'bcd', 'e'], 4, 2],
		[['a', 'bcd', 'e'], 5, -1],
	];
	test.each(cases)('%p %p %p', (array: string[], position: number, expected: number) => {
		expect(array.indexOfPosition(position)).toBe(expected);
	});
});
describe('Array.zip', () => {
	let cases = [
		[[], [1, 2, 3], [1, 2, 3]],
		[[1, 2, 3], [], [1, 2, 3]],
		[['a', 'b', 'c'], [1, 2, 3], ['a', 1, 'b', 2, 'c', 3]],
		[[1, 2, 3], ['a', 'b', 'c', 'd', 'e'], [1, 'a', 2, 'b', 3, 'c', 'd', 'e']],
	];
	test.each(cases)('zip(%p,%p) == %p', (a: any[], b: any[], c: any[]) => {
		expect(a.zip(b)).toStrictEqual(c);
	});
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
		[['abc', 'def'], 3, 1],
		[['a', 'b', 'c'], 0, 0],
		[['a', 'b', 'c'], 1, 1],
		[['a', 'b', 'c'], 2, 2],
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


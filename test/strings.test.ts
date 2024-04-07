import '../src/strings';

describe('unzip', () => {
	let cases = {
		'abc': [['abc'], ['']],
		'a b c': [['a', 'b', 'c'], [' ', ' ', '']],
		'a! b... c?': [['a', 'b', 'c'], ['! ', '... ', '?']],
		'...a.b.c...': [['', 'a', 'b', 'c'], ['...', '.', '.', '...']]
		'\na\rb\tc': [['', 'a', 'b', 'c'], ['\n', '\r', '\t', '']],
		'a': [['a'], ['']]
	};
	for (const [input, expected] of Object.entries(cases)) {
		it(input, () => {
			expect(input.unzip()).toStrictEqual(expected);
		});
	};
});


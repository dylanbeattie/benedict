import '../src/strings';

describe('unzip', () => {
	let cases = {
		'abc': [ ['abc'], ['']],
		'a b c': [ ['a', 'b', 'c'], [' ',' ','']],
		'a! b... c?': [[ 'a', 'b', 'c' ], ['! ', '... ', '?']],
		'...a.b.c...': [[ '', 'a', 'b', 'c' ], ['...', '.', '.', '...']]
	};
	for(const [ input, expected ] of Object.entries(cases)) {
		it(input, () => {
			expect(input.unzip()).toStrictEqual(expected);
		});
	});
});


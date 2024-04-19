import '../src/strings';

describe('lastWord() of ', () => {
	let cases : [string,string][]= [
		['big dog!', 'dog'],
		['apple', 'apple'],
		['No way...', 'way'],
		['', ''],
	];
	test.each(cases)('%p is %p', (text: string, word: string) => {
		expect(text.lastWord()).toBe(word);
	});
})
describe('unzip', () => {
	let cases = {
		'abc': [['abc'], ['']],
		'a b c': [['a', 'b', 'c'], [' ', ' ', '']],
		'a! b... c?': [['a', 'b', 'c'], ['! ', '... ', '?']],
		'...a.b.c...': [['', 'a', 'b', 'c'], ['...', '.', '.', '...']],
		'\na\rb\tc': [['', 'a', 'b', 'c'], ['\n', '\r', '\t', '']],
		'a': [['a'], ['']]
	};
	for (const [input, expected] of Object.entries(cases)) {
		it(input, () => {
			expect(input.unzip()).toStrictEqual(expected);
		});
	};
});


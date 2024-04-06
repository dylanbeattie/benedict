import Matcher from '../src/matcher';

describe('abc def ghi', () => {
	let matcher = new Matcher('abc def ghi');
	let cases : [string,number][] = [
		['', 0],
		['a', 1 ],
		['ab', 2 ],
		['abc d', 5 ]
	];
	test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
		expect(matcher.match(fragment)).toBe(index);
	});
});

let input = 'ABC def GHI';

describe(input, () => {
	let matcher = new Matcher(input);
	let cases : [string,number][] = [
		['', 0],
		['a', 1 ],
		['ab', 2 ],
		['abcd', 5 ]
	];
	test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
		expect(matcher.match(fragment)).toBe(index);
	});
});

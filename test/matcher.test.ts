import Matcher from '../src/matcher';

describe('abc def ghi', () => {
    let matcher = new Matcher('abc def ghi');
    let cases: [string, number][] = [
        ['', 0],
        ['a', 1],
        ['ab', 2],
        ['abc d', 5]
    ];
    test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
        expect(matcher.match(fragment, 0, 5)).toBe(index);
    });
});
describe('when text starts with non-word characters', () => {
    let cases: [string, string, number][] = [
        ['"hello", I said', 'hello', 9],
        [' a ', 'a', 3],
        ['...b...', 'b', 7]
    ];
    test.each(cases)('Matcher(%p).match(%p) == %p', (text: string, fragment: string, expected: number) => {
        let matcher = new Matcher(text);
        expect(matcher.match(fragment, 0, 20)).toBe(expected);
    })
})

let input = "Don't make O'Brien 'angry'.";
describe(input, () => {
    let matcher = new Matcher(input);
    describe('when fragment does not match', () => {
        let cases: [string, number][] = [
            ['don', 4],
            ['don\'t', 6],
            ["don't make o'bri", 16],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment, 0, 20)).toBe(index);
        });
    });
});
describe('when fragment is found in fancy text', () => {
	let input = "a-b-c-d-e";
	let matcher = new Matcher(input);
	let cases: [string, number][] = [
		['a', 0],
		['b', 1],
		['abc', 0],
		['cde', 2],
		['abcde', 0],
		['de', 3]
	];
	test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
		expect(matcher.findPlainIndex(fragment, 0, 10)).toBe(index);
	});
})

describe('match using window size with punctuation', () => {
    var matcher = new Matcher('"Bear-faced chic!" will probably be misinterpreted');
    let cases: [string,number,number,number][] = [
        ['bare faced cheek will', 0, 20, -1],
        ['faced cheek will probably be', 0, 10, -1],
        ['will probably be', 0, 50, 36],
        ['probably be misint', 0, 60, 42],
        ['probably be misint', 20, 40, 42],
        ['probably be misint', 20, 25, 42]
    ];
    test.each(cases)('%p %p %p %p', (speech, position, scope, expected) => {
        expect(matcher.match(speech, position, scope)).toBe(expected);
    });
});
input = 'ABC def GHI';

describe(input, () => {
    let matcher = new Matcher(input);
    describe('when fragment does not match', () => {
        let cases: [string, number][] = [
            ['a x y', -1],
            ['xyz', -1],
            // ['!', -1],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment, 0, 0)).toBe(index);
        });
    });
    describe('when fragment matches complete tokens', () => {
        let cases: [string, number][] = [
            ['', 0],
            ['abc', 4],
            ['abc def', 8],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment, 0, 10)).toBe(index);
        });

    });
    describe('when fragment matches partial tokens', () => {
        let cases: [string, number][] = [
            ['a', 1],
            ['ab', 2],
            ['abc d', 5],
            ['abc de', 6],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment, 0, 10)).toBe(index);
        });
    });
    describe('when fragment matches multiple tokens', () => {
        let cases: [string, number][] = [
            //['abcd', 5 ],
            ['abcdefg', 9],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment, 0, 10)).toBe(index);
        });
    });
});

input = `“I have detected,” he said, “disturbances in the wash.”
“The wash?” said Arthur.
“The space-time wash,” said Ford.
Arthur nodded, and then cleared his throat.
“Are we talking about,” he asked cautiously, “some sort of Vogon laundromat, or what are we talking about?”
“Eddies,” said Ford, “in the space-time continuum.”
“Ah,” nodded Arthur, “is he? Is he?” He pushed his hands into the pocket of his dressing gown and looked knowledgeably into the distance.
“What?” said Ford.
“Er, who,” said Arthur, “is Eddy, then, exactly?”
Ford looked angrily at him.
“Will you listen?” he snapped.
“I have been listening,” said Arthur, “but I’m not sure it’s helped.”`;

describe('“I have detected,” ...', () => {
    let matcher = new Matcher(input);
    let cases: [string, number][] = [
		['or what are we talking about', 268]
    ];
    test.each(cases)('matches %p at %p', (speech: string, index: number) => {
        expect(matcher.match(speech, 240, 40)).toBe(index);
    });
});

input = `"Eddies," said Ford, "in the space-time continuum."

"Ah," nodded Arthur, "is he? Is he?" He pushed his hands into the pocket of his dressing gown and looked knowledgeably into the distance.

"What?" said Ford.

"Er, who," said Arthur, "is Eddy, then, exactly?"`

describe('Eddies...', () => {
    let matcher = new Matcher(input);
    let cases: [string, number][] = [
        ['eddies', 10], // should match '"Eddies," ' including the trailing space
        ['eddies said ford', 22 ], // should match "Eddies," said Ford, "
        ['eddies said ford in the space time continuum ah nodded arthur', 75 ],
        ['eddies said ford in the space time continuum ah nodded arthur is he is he he pushed', 100 ],
        ['eddies said Ford in the space time continuum ah nodded arthur', 75 ]
    ];
    test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
        expect(matcher.match(fragment, 0, 200)).toBe(index);
    });
});

// The Sky Was, ee cummings
let poem = `the
sky
    was
can    dy    lu
minous
       edible`;

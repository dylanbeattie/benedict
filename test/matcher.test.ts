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
    describe('when fragment matches complete tokens', () => {
        let cases : [string,number][] = [
            ['', 0],
            ['abc', 4 ],
            ['abc def', 8 ],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment)).toBe(index);
        });

    });
    describe('when fragment matches partial tokens', () => {
        let cases : [string,number][] = [
            ['a', 1 ],
            ['ab', 2 ],
            ['abc d', 5 ],
            ['abc de', 6 ],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment)).toBe(index);
        });
    });
    describe('when fragment matches multiple tokens', () => {
        let cases : [string,number][] = [
            ['abcd', 5 ],
            ['abcdefg', 9 ],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment)).toBe(index);
        });
    }
});

input = `"Eddies," said Ford, "in the space-time continuum."

"Ah," nodded Arthur, "is he? Is he?" He pushed his hands into the pocket of his dressing gown and looked knowledgeably into the distance.

"What?" said Ford.

"Er, who," said Arthur, "is Eddy, then, exactly?"`

describe('Eddies...', () => {
	let matcher = new Matcher(input);
	let cases : [string,number][] = [
        ['eddies', 8], // should match "Eddies,"
        // ['eddies said ford', 20 ], // should match "Eddies," said Ford, (including the trailing space)
        // ['eddies said ford in the space time continuum ah nodded arthur', 75 ],
        // ['eddies said ford in the space time continuum ah nodded arthur is he is he he pushed', 101 ]
    ];
    test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
        expect(matcher.match(fragment)).toBe(index);
    });
});

// The Sky Was, ee cummings
let poem = `the
sky
    was
can    dy    lu
minous
       edible`;

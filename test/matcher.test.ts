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
        expect(matcher.match(fragment)).toBe(index);
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
        expect(matcher.match(fragment)).toBe(expected);
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
            expect(matcher.match(fragment)).toBe(index);
        });
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
            expect(matcher.match(fragment)).toBe(index);
        });
    });
    describe('when fragment matches complete tokens', () => {
        let cases: [string, number][] = [
            ['', 0],
            ['abc', 4],
            ['abc def', 8],
        ];
        test.each(cases)('matches %p at %p', (fragment: string, index: number) => {
            expect(matcher.match(fragment)).toBe(index);
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
            expect(matcher.match(fragment)).toBe(index);
        });
    });
    describe('when fragment matches multiple tokens', () => {
        let cases: [string, number][] = [
            //['abcd', 5 ],
            ['abcdefg', 9],
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
    let cases: [string, number][] = [
        ['eddies', 10], // should match '"Eddies," ' including the trailing space
        ['eddies said ford', 22 ], // should match "Eddies," said Ford, " 
        ['eddies said ford in the space time continuum ah nodded arthur', 75 ],
        ['eddies said ford in the space time continuum ah nodded arthur is he is he he pushed', 100 ]
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

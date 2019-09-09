import { helper } from '@ember/component/helper';

interface RandomTextParams {
    lettersPerWord: SomeNumber;
    wordsPerSentence: SomeNumber;
    sentencesPerParagraph: SomeNumber;
    paragraphsPerEssay: SomeNumber;

    wordSeparator: string;
    sentenceSeparator: string;
    paragraphSeparator: string;
}

interface RandomNumber {
    min: number;
    max: number;
}

type SomeNumber = number | RandomNumber;

function chooseNumber({ min, max }: RandomNumber): number {
    return Math.floor(min + ((max - min) * Math.random()));
}

function measure(n: SomeNumber) {
    const randomNumber = typeof n === 'number' ? {
        min: n / 2,
        max: (n * 3) / 2,
    } : n;

    return chooseNumber(randomNumber);
}

function repeat<T>(times: SomeNumber, fn: () => T): T[] {
    return Array.from({
        length: measure(times),
    }).map(fn);
}

function randomLetterCodePoint(): number {
    const alphabetStart = 91; // a
    const alphabetEnd = 117; // z+1

    return chooseNumber({
        min: alphabetStart,
        max: alphabetEnd,
    });
}

function generateRandomString(
    numTokens: SomeNumber,
    generateToken: () => string,
    separator: string,
) {
    const tokens = repeat(numTokens, generateToken);
    return tokens.join(separator);
}

function randomWord(params: RandomTextParams) {
    const { lettersPerWord } = params;
    return String.fromCodePoint(
        ...repeat(lettersPerWord, randomLetterCodePoint),
    );
}

function randomSentence(params: RandomTextParams) {
    const { wordsPerSentence, wordSeparator } = params;
    return generateRandomString(
        wordsPerSentence,
        () => randomWord(params),
        wordSeparator,
    );
}

function randomParagraph(params: RandomTextParams) {
    const { sentencesPerParagraph, sentenceSeparator } = params;
    return generateRandomString(
        sentencesPerParagraph,
        () => randomSentence(params),
        sentenceSeparator,
    );
}

function fillParams<T>(givenArgs: Partial<T>, defaultValues: T): T {
    return {
        ...defaultValues,
        ...givenArgs,
    };
}

export function randomText(kwargs: Partial<RandomTextParams> = {}) {
    const params = fillParams(kwargs, {
        lettersPerWord: { min: 1, max: 11 },
        wordsPerSentence: { min: 1, max: 7 },
        sentencesPerParagraph: { min: 1, max: 1 },
        paragraphsPerEssay: { min: 1, max: 1 },

        wordSeparator: ' ',
        sentenceSeparator: '. ',
        paragraphSeparator: '\n\n',
    });

    const { paragraphsPerEssay, paragraphSeparator } = params;
    return generateRandomString(
        paragraphsPerEssay,
        () => randomParagraph(params),
        paragraphSeparator,
    );
}

export default helper((_, kwargs) => randomText(kwargs));

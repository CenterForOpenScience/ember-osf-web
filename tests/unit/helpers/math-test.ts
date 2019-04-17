import { Delimiter, DELIMITERS, replace } from 'app-components/helpers/math';
import { module, test } from 'qunit';

const TEX_EXPRS = [
    'x^2 + y^2 = 1',

    'f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi',

    ` % \\f is defined as f(#1) using the macro
    \\f{x} = \\int_{-\\infty}^\\infty
    \\hat \\f\\xi\\,e^{2 \\pi \\$ \\$ i \\xi x}
    \\,d\\xi`,
];

const TEMPLATES = [
    (expr: string) => `This is TeX: ${expr}`,
    (expr: string) => `${expr} is some TeX`,
    (expr: string) => `${expr} TeX is leading and ending here ${expr}`,
    (expr: string) => `${expr} ${expr} Double Trouble!`,
    (expr: string) => `Some TeX ${expr} surrounded by text`,
    (expr: string) => expr,
    (_: string) => 'Haha, No Tex here!',
];

const TEST_CASES: Array<{ input: string, output: string }> = [];

for (const template of TEMPLATES) {
    for (const texExpression of TEX_EXPRS) {
        for (const delimitter of DELIMITERS) {
            TEST_CASES.push({
                input: template(`${delimitter.start}${texExpression}${delimitter.end}`),
                output: template(`<Length: ${texExpression.length}, Inline: ${delimitter.inline}>`),
            });
        }
    }
}

module('Unit | Helper | math', _ => {
    test('it parses', assert => {
        for (const testCase of TEST_CASES) {
            const result = replace(
                testCase.input,
                DELIMITERS,
                (expr: string, delim: Delimiter) => `<Length: ${expr.length}, Inline: ${delim.inline}>`,
            );

            assert.equal(result, testCase.output, `Properly parsed ${testCase.input}`);
        }
    });
});

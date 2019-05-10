import { module, test } from 'qunit';

import leafVals from 'ember-osf-web/utils/leaf-vals';

const TEST_CASES = [{
    name: 'empty object',
    input: {},
    output: [],
}, {
    name: 'simple object with single value',
    input: {
        foo: 'bar',
    },
    output: ['bar'],
}, {
    name: 'simple object with multiple values',
    input: {
        foo: 'bar',
        baz: 'qux',
    },
    output: ['bar', 'qux'],
}, {
    name: 'one-level object',
    input: {
        foo: {
            a: 'bar',
            b: 'baz',
        },
    },
    output: ['bar', 'baz'],
}, {
    name: 'multiple one-level objects',
    input: {
        foo: {
            a: 'bar',
            b: 'baz',
        },
        qux: {
            a: 'corge',
            b: 'grault',
        },
    },
    output: ['bar', 'baz', 'corge', 'grault'],
}, {
    name: 'mixed simple and one-level object',
    input: {
        foo: {
            a: 'bar',
            b: 'baz',
        },
        qux: 'corge',
    },
    output: ['bar', 'baz', 'corge'],
}, {
    name: 'mixed simple, one, and multi-level objects',
    input: {
        foo: {
            a: 'bar',
            b: {
                c: 'baz',
            },
        },
        qux: {
            a: 'corge',
            b: 'grault',
        },
        garply: 'waldo',
    },
    output: ['bar', 'baz', 'corge', 'grault', 'waldo'],
}];

module('Unit | Utility | leafvals', () => {
    test('leafVals returns all values for leaves in an object tree', assert => {
        for (const testCase of TEST_CASES) {
            assert.deepEqual(leafVals(testCase.input), testCase.output, `Test case: ${testCase.name}`);
        }
    });
});

import { camelizeKeys, mapKeysAndValues, snakifyKeys } from 'ember-osf-web/utils/map-keys';
import { module, test } from 'qunit';

const caseCases = [
    {
        input: {},
        camelized: {},
        snakified: {},
    },
    {
        input: { foo: 1, bar: 2 },
        camelized: { foo: 1, bar: 2 },
        snakified: { foo: 1, bar: 2 },
    },
    {
        input: { fooBar: 1, barT: 2, baz: undefined },
        camelized: { fooBar: 1, barT: 2, baz: undefined },
        snakified: { foo_bar: 1, bar_t: 2, baz: undefined },
    },
    {
        input: { foo_bar: 1, bar: 2, bazZz: 3 },
        camelized: { fooBar: 1, bar: 2, bazZz: 3 },
        snakified: { foo_bar: 1, bar: 2, baz_zz: 3 },
    },
    {
        input: { FooBar: 1, bar: 2 },
        camelized: { fooBar: 1, bar: 2 },
        snakified: { foo_bar: 1, bar: 2 },
    },
    {
        input: { 'foo-bar': 1, bar_baz: 2 },
        camelized: { fooBar: 1, barBaz: 2 },
        snakified: { foo_bar: 1, bar_baz: 2 },
    },
    {
        input: { fooBar: 1, foo_bar: 2 },
        camelized: new Error('Mapping keys causes duplicate key: "fooBar"'),
        snakified: new Error('Mapping keys causes duplicate key: "foo_bar"'),
    },
    {
        input: { 'foo-bar': 1, fooBar: 2 },
        camelized: new Error('Mapping keys causes duplicate key: "fooBar"'),
        snakified: new Error('Mapping keys causes duplicate key: "foo_bar"'),
    },
    {
        input: { 'foo-bar': 1, foo_bar: 2 },
        camelized: new Error('Mapping keys causes duplicate key: "fooBar"'),
        snakified: new Error('Mapping keys causes duplicate key: "foo_bar"'),
    },
];

const keysAndValuesCases = [
    {
        input: { foo: 1, bar: 2 },
        keyMap: (k: string) => `${k}${k}`,
        valueMap: (v: number) => v * v,
        expected: { foofoo: 1, barbar: 4 },
    },
    {
        input: { foo: 1, bar: 2 },
        keyMap: (_: string) => 'lol',
        valueMap: (v: number) => v * v,
        expected: new Error('Mapping keys causes duplicate key: "lol"'),
    },
];

function assertPasses(assert: Assert, testFn: () => object, expected: Error | object) {
    if (expected instanceof Error) {
        assert.throws(
            testFn,
            expected,
            'Correctly errors',
        );
    } else {
        assert.deepEqual(
            testFn(),
            expected,
        );
    }
}

module('Unit | Utility | map-keys', () => {
    test('camelizeKeys camelizes keys', assert => {
        assert.expect(caseCases.length);
        caseCases.forEach(testCase => {
            assertPasses(
                assert,
                () => camelizeKeys(testCase.input),
                testCase.camelized,
            );
        });
    });

    test('snakifyKeys snakifies keys', assert => {
        assert.expect(caseCases.length);
        caseCases.forEach(testCase => {
            assertPasses(
                assert,
                () => snakifyKeys(testCase.input),
                testCase.snakified,
            );
        });
    });

    test('mapKeysAndValues maps keys and values', assert => {
        assert.expect(keysAndValuesCases.length);
        keysAndValuesCases.forEach(testCase => {
            assertPasses(
                assert,
                () => mapKeysAndValues(
                    testCase.input,
                    testCase.keyMap,
                    testCase.valueMap,
                ),
                testCase.expected,
            );
        });
    });
});

import param, { addQueryParam } from 'ember-osf-web/utils/param';
import { module, test } from 'qunit';

module('Unit | Utility | param', () => {
    test('it creates a query string from params', assert => {
        assert.equal(
            param({
                foo: 'boo',
                bar: 'car',
            }),
            'foo=boo&bar=car',
        );
    });

    test('it creates an empty query string from empty params', assert => {
        assert.equal(
            param({}),
            '',
        );
    });

    test('it url encodes keys and values', assert => {
        assert.equal(
            param({
                'foo/bar': 'boo,hoo',
            }),
            'foo%2Fbar=boo%2Choo',
        );
    });

    test('addQueryParam', assert => {
        const testCases = [
            {
                initial: 'https://osf.io/',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?foo=bar',
            },
            {
                initial: 'https://osf.io/?blah=blee',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?blah=blee&foo=bar',
            },
            {
                initial: 'https://osf.io/?aoeu=aoeu&blah=blee#hahafragment',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?aoeu=aoeu&blah=blee&foo=bar#hahafragment',
            },
            {
                initial: 'https://osf.io/#hahafragment',
                key: 'foo',
                val: 'bar',
                expected: 'https://osf.io/?foo=bar#hahafragment',
            },
        ];

        for (const testCase of testCases) {
            const actual = addQueryParam(
                testCase.initial,
                testCase.key,
                testCase.val,
            );
            assert.equal(actual, testCase.expected, 'addQueryParam added query param');
        }
    });
});

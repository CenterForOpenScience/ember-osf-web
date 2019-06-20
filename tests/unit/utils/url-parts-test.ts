import { addPathSegment, addQueryParam, joinUrl, splitUrl } from 'ember-osf-web/utils/url-parts';
import { module, test } from 'qunit';

module('Unit | Utility | url-parts', () => {
    test('splitUrl and joinUrl', assert => {
        const testCases = [
            {
                input: 'https://osf.io/',
                expected: {
                    path: 'https://osf.io/',
                    queryString: undefined,
                    fragment: undefined,
                },
            },
            {
                input: 'https://osf.io/?blah=blee',
                expected: {
                    path: 'https://osf.io/',
                    queryString: 'blah=blee',
                    fragment: undefined,
                },
            },
            {
                input: 'https://osf.io/?aoeu=aoeu&blah=blee#hahafragment',
                expected: {
                    path: 'https://osf.io/',
                    queryString: 'aoeu=aoeu&blah=blee',
                    fragment: 'hahafragment',
                },
            },
            {
                input: 'https://osf.io/#hahafragment',
                expected: {
                    path: 'https://osf.io/',
                    queryString: undefined,
                    fragment: 'hahafragment',
                },
            },
            {
                input: '/?aoeu=aoeu&blah=blee#hahafragment',
                expected: {
                    path: '/',
                    queryString: 'aoeu=aoeu&blah=blee',
                    fragment: 'hahafragment',
                },
            },
            {
                input: '/some/path/#hahafragment',
                expected: {
                    path: '/some/path/',
                    queryString: undefined,
                    fragment: 'hahafragment',
                },
            },
            {
                input: '/#hahafragment',
                expected: {
                    path: '/',
                    queryString: undefined,
                    fragment: 'hahafragment',
                },
            },
        ];

        for (const testCase of testCases) {
            const actual = splitUrl(testCase.input);
            assert.deepEqual(actual, testCase.expected, 'splitUrl split the URL');
            const rejoined = joinUrl(actual);
            assert.equal(rejoined, testCase.input, 'joinUrl rejoins to the same URL');
        }
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

    test('addPathSegment', assert => {
        const testCases = [
            {
                initial: 'https://osf.io/',
                segment: 'foo',
                expected: 'https://osf.io/foo',
            },
            {
                initial: 'https://osf.io/?blah=blee',
                segment: 'foo',
                expected: 'https://osf.io/foo?blah=blee',
            },
            {
                initial: 'https://osf.io/woo/?aoeu=aoeu&blah=blee#hahafragment',
                segment: 'foo',
                expected: 'https://osf.io/woo/foo?aoeu=aoeu&blah=blee#hahafragment',
            },
            {
                initial: 'https://osf.io/#hahafragment',
                segment: 'foo/blah/boo',
                expected: 'https://osf.io/foo/blah/boo#hahafragment',
            },
        ];

        for (const testCase of testCases) {
            const actual = addPathSegment(
                testCase.initial,
                testCase.segment,
            );
            assert.equal(actual, testCase.expected, 'addPathSegment added a path segment');
        }
    });
});

import { module, test } from 'qunit';

import cleanURL, { notFoundURL } from 'ember-osf-web/utils/clean-url';

const TEST_CASES = [{
    input: '/--user/abcd',
    cleanOutput: '/abcd',
    notFoundOutput: 'abcd',
}, {
    input: '/--user/--nested/abcd',
    cleanOutput: '/abcd',
    notFoundOutput: 'abcd',
}, {
    input: '/--registries-engine/overview',
    cleanOutput: '/overview',
    notFoundOutput: 'overview',
}, {
    input: '/collections/--something--else/here',
    cleanOutput: '/collections/here',
    notFoundOutput: 'collections/here',
}, {
    input: '/--registries',
    cleanOutput: '/',
    notFoundOutput: '',
}, {
    input: '/AttheEnd/--registries',
    cleanOutput: '/AttheEnd',
    notFoundOutput: 'AttheEnd',
}, {
    input: '/normal--url',
    cleanOutput: '/normal--url',
    notFoundOutput: 'normal--url',
}, {
    input: '/--user/abcd/',
    cleanOutput: '/abcd',
    notFoundOutput: 'abcd',
}, {
    input: '/--user/--nested/abcd/',
    cleanOutput: '/abcd',
    notFoundOutput: 'abcd',
}, {
    input: '/--registries-engine/overview/',
    cleanOutput: '/overview',
    notFoundOutput: 'overview',
}, {
    input: '/collections/--something--else/here/',
    cleanOutput: '/collections/here',
    notFoundOutput: 'collections/here',
}, {
    input: '/--registries/',
    cleanOutput: '/',
    notFoundOutput: '',
}, {
    input: '/AttheEnd/--registries/',
    cleanOutput: '/AttheEnd',
    notFoundOutput: 'AttheEnd',
}, {
    input: '/normal--url/',
    cleanOutput: '/normal--url',
    notFoundOutput: 'normal--url',
}, {
    input: '/--user/--nested/abcd?foo=7',
    cleanOutput: '/abcd?foo=7',
    notFoundOutput: 'abcd',
}, {
    input: '/--registries-engine/overview?foo=7',
    cleanOutput: '/overview?foo=7',
    notFoundOutput: 'overview',
}, {
    input: '/collections/--something--else/here?blah=boo&another',
    cleanOutput: '/collections/here?blah=boo&another',
    notFoundOutput: 'collections/here',
}, {
    input: '/--registries?aoeu=aoeu',
    cleanOutput: '/?aoeu=aoeu',
    notFoundOutput: '',
}, {
    input: '/AttheEnd/--registries?query=param',
    cleanOutput: '/AttheEnd?query=param',
    notFoundOutput: 'AttheEnd',
}, {
    input: '/normal--url?query=param',
    cleanOutput: '/normal--url?query=param',
    notFoundOutput: 'normal--url',
}, {
    input: '/--user/--nested/abcd/?foo=7',
    cleanOutput: '/abcd?foo=7',
    notFoundOutput: 'abcd',
}, {
    input: '/--registries-engine/overview/?foo=7',
    cleanOutput: '/overview?foo=7',
    notFoundOutput: 'overview',
}, {
    input: '/collections/--something--else/here/?blah=boo&another',
    cleanOutput: '/collections/here?blah=boo&another',
    notFoundOutput: 'collections/here',
}, {
    input: '/--registries/?aoeu=aoeu',
    cleanOutput: '/?aoeu=aoeu',
    notFoundOutput: '',
}, {
    input: '/AttheEnd/--registries/?query=param',
    cleanOutput: '/AttheEnd?query=param',
    notFoundOutput: 'AttheEnd',
}, {
    input: '/normal--url/?query=param',
    cleanOutput: '/normal--url?query=param',
    notFoundOutput: 'normal--url',
}, {
    input: '/--user/abcd/#frag',
    cleanOutput: '/abcd#frag',
    notFoundOutput: 'abcd#frag',
}, {
    input: '/--user/abcd/?query=param#frag',
    cleanOutput: '/abcd?query=param#frag',
    notFoundOutput: 'abcd#frag',
}];

module('Unit | Utility | cleanURL', () => {
    test('cleanURL cleans urls', assert => {
        assert.expect(TEST_CASES.length);

        for (const testCase of TEST_CASES) {
            assert.equal(cleanURL(testCase.input), testCase.cleanOutput);
        }
    });

    test('notFoundURL appropriately cleans', assert => {
        assert.expect(TEST_CASES.length);

        for (const testCase of TEST_CASES) {
            assert.equal(notFoundURL(testCase.input), testCase.notFoundOutput);
        }
    });
});

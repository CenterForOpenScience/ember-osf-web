import { module, test } from 'qunit';

import cleanURL from 'ember-osf-web/utils/clean-url';

const TEST_CASES = [{
    input: '/--user/abcd',
    output: '/abcd',
}, {
    input: '/--user/--nested/abcd',
    output: '/abcd',
}, {
    input: '/--registries-engine/overview',
    output: '/overview',
}, {
    input: '/collections/--something--else/here',
    output: '/collections/here',
}, {
    input: '/--registries',
    output: '',
}, {
    input: '/AttheEnd/--registries',
    output: '/AttheEnd',
}, {
    input: '/normal--url',
    output: '/normal--url',
}];

module('Unit | Utility | cleanURL', () => {
    test('cleanURL cleans urls', assert => {
        assert.expect(TEST_CASES.length * 2);

        for (const testCase of TEST_CASES) {
            assert.equal(cleanURL(testCase.input), testCase.output);
            assert.equal(cleanURL(`${testCase.input}/`), `${testCase.output}/`);
        }
    });
});

import GuidAutoLocation from 'ember-osf-web/locations/auto';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const TEST_CASES = [{
    input: '/--user/abcd/',
    output: '/abcd/',
}, {
    input: '/--user/abcd',
    output: '/abcd',
}, {
    input: '/--user/--nested/abcd/',
    output: '/abcd/',
}, {
    input: '/--registries-engine/overview/',
    output: '/overview/',
}, {
    input: '/collections/--something--else/here/',
    output: '/collections/here/',
}, {
    input: '/--registries/',
    output: '/',
}, {
    input: '/AttheEnd/--registries/',
    output: '/AttheEnd/',
}, {
    input: '/AttheEnd/--registries',
    output: '/AttheEnd',
}, {
    input: '/normal--url/',
    output: '/normal--url/',
}];

module('Unit | Location | guid-auto ', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        assert.ok(this.owner.lookup('location:auto') instanceof GuidAutoLocation);
    });

    test('cleanURL', function(assert) {
        const location = this.owner.lookup('location:auto') as GuidAutoLocation;

        for (const testCase of TEST_CASES) {
            assert.equal(location.cleanURL(testCase.input), testCase.output);
        }
    });
});

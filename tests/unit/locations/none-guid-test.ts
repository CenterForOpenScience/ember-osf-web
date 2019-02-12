import GuidNoneLocation from 'ember-osf-web/locations/none';
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
}];

module('Unit | Location | none-auto ', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        assert.ok(this.owner.lookup('location:none') instanceof GuidNoneLocation);
    });

    test('setURL does not clean', function(assert) {
        const location = this.owner.lookup('location:none') as GuidNoneLocation;

        for (const testCase of TEST_CASES) {
            location.setURL(testCase.input);

            assert.equal(location.path, testCase.input);
            assert.notEqual(location.path, testCase.output);
        }
    });
});

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import fixStringTestCases from '../../fixtures/specialChars';

module('Unit | Transform | fixstring', function(hooks) {
    setupTest(hooks);

    test('#serialize does not alter values sent from the server', function(assert) {
        const transform = this.owner.lookup('transform:fixstring');

        assert.expect(fixStringTestCases.length);

        for (const [raw] of fixStringTestCases) {
            const res = transform.serialize(raw);
            assert.equal(res, raw, 'Serialized string did not match raw value');
        }
    });

    test('#deserialize converts values sent from the server into something display friendly', function(assert) {
        const transform = this.owner.lookup('transform:fixstring');

        assert.expect(fixStringTestCases.length);

        for (const [input, output] of fixStringTestCases) {
            const res = transform.deserialize(input);
            assert.strictEqual(res, output, 'Incorrect string deserialization');
        }
    });
});

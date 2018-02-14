import { moduleFor, test } from 'ember-qunit';

import { fixStringTestCases } from '../../fixtures/specialChars';

moduleFor('transform:fixstring', 'Unit | Transform | fixstring', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
});

test('#serialize does not alter values sent from the server', function(assert) {
    const transform = this.subject();

    assert.expect(fixStringTestCases.length);

    for (const [raw] of fixStringTestCases) {
        const res = transform.serialize(raw);
        assert.equal(res, raw, 'Serialized string did not match raw value');
    }
});

test('#deserialize converts values sent from the server into something display friendly', function(assert) {
    const transform = this.subject();

    assert.expect(fixStringTestCases.length);

    for (const [input, output] of fixStringTestCases) {
        const res = transform.deserialize(input);
        assert.strictEqual(res, output, 'Incorrect string deserialization');
    }
});

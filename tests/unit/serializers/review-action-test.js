import { moduleForModel, test } from 'ember-qunit';

moduleForModel('review-action', 'Unit | Serializer | review-action', {
    // Specify the other units that are required for this test.
    needs: ['serializer:review-action', 'model:preprint-provider', 'model:user', 'model:preprint'],
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    const record = this.subject();

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});

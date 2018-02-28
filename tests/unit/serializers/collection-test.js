import { moduleForModel, test } from 'ember-qunit';

moduleForModel('collection', 'Unit | Serializer | collection', {
    // Specify the other units that are required for this test.
    needs: ['serializer:collection', 'model:node', 'model:registration'],
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    const record = this.subject();

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});

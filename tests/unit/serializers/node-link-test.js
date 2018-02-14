import { moduleForModel, test } from 'ember-qunit';

moduleForModel('node-link', 'Unit | Serializer | node link', {
    // Specify the other units that are required for this test.
    needs: ['serializer:node-link', 'serializer:node', 'model:node'],
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    const record = this.subject();

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});

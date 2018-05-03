import { moduleForModel, test } from 'ember-qunit';

moduleForModel('file-provider', 'Unit | Serializer | file provider', {
    // Specify the other units that are required for this test.
    needs: ['serializer:file-provider', 'model:file', 'model:node',
        'transform:links', 'transform:embed'],
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    const record = this.subject();

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('draft-registration', 'Unit | Serializer | draft registration', {
    // Specify the other units that are required for this test.
    needs: [
        'serializer:draft-registration', 'model:node', 'model:user', 'model:draft-registration', 'model:metaschema',
    ],
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    const record = this.subject();

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('preprint-provider', 'Unit | Serializer | preprint provider', {
    needs: [
        'serializer:preprint-provider',
        'model:taxonomy',
        'model:preprint',
        'model:license',
    ],
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    const record = this.subject();

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});

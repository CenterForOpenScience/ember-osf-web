import { moduleForModel, test } from 'ember-qunit';

moduleForModel('file-provider', 'Unit | Model | file provider', {
    // Specify the other units that are required for this test.
    needs: ['model:file', 'model:node'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

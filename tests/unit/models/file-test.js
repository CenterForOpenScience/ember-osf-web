import { moduleForModel, test } from 'ember-qunit';

moduleForModel('file', 'Unit | Model | file', {
    // Specify the other units that are required for this test.
    needs: ['model:file-version', 'model:comment', 'model:node', 'model:user', 'transform:object', 'transform:array'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

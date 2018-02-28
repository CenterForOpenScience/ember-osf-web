import { moduleForModel, test } from 'ember-qunit';

moduleForModel('node-link', 'Unit | Model | node link', {
    // Specify the other units that are required for this test.
    needs: ['model:node', 'model:node-link'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

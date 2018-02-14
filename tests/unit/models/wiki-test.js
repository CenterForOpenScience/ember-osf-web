import { moduleForModel, test } from 'ember-qunit';

moduleForModel('wiki', 'Unit | Model | wiki', {
    // Specify the other units that are required for this test.
    needs: ['model:node'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

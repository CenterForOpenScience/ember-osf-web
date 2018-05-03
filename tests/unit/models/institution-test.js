import {
    moduleForModel,
    test,
} from 'ember-qunit';

moduleForModel('institution', 'Unit | Model | institution', {
    // Specify the other units that are required for this test.
    needs: ['model:user', 'model:node', 'model:registration'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

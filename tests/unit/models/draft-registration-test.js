import { moduleForModel, test } from 'ember-qunit';

moduleForModel('draft-registration', 'Unit | Model | draft registration', {
    // Specify the other units that are required for this test.
    needs: ['model:draft-registration', 'model:user', 'model:node', 'model:metaschema'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

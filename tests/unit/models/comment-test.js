import { moduleForModel, test } from 'ember-qunit';

moduleForModel('comment', 'Unit | Model | comment', {
    // Specify the other units that are required for this test.
    needs: ['model:node', 'model:comment-report', 'model:user'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

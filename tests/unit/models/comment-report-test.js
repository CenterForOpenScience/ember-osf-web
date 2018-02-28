import { moduleForModel, test } from 'ember-qunit';

moduleForModel('comment-report', 'Unit | Model | comment report', {
    // Specify the other units that are required for this test.
    needs: ['model:comment'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('license', 'Unit | Model | license', {
    // Specify the other units that are required for this test.
    needs: ['transform:array'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

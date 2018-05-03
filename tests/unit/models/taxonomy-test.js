import { moduleForModel, test } from 'ember-qunit';

moduleForModel('taxonomy', 'Unit | Model | taxonomy', {
    // Specify the other units that are required for this test.
    needs: ['transform:object'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

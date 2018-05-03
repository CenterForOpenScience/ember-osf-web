import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:collection', 'Unit | Adapter | collection', {
    // Specify the other units that are required for this test.
    needs: ['service:session'],
});

// Replace this with your real tests.
test('it exists', function(assert) {
    const adapter = this.subject();
    assert.ok(adapter);
});

import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:license', 'Unit | Adapter | license', {
    // Specify the other units that are required for this test.
    needs: ['service:session'],
});

// Replace this with your real tests.
test('it exists', function(assert) {
    const adapter = this.subject();
    assert.ok(adapter);
});

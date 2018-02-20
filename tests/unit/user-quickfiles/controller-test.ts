import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:user-quickfiles', 'Unit | Controller | user quickfiles', {
    needs: [
        'service:currentUser',
        'service:metrics',
    ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
    const controller = this.subject();
    assert.ok(controller);
});

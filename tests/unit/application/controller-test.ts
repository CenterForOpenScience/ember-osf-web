import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:application', 'Unit | Controller | application', {
    needs: [
        'service:session',
        'service:metrics',
        'service:features',
        'service:analytics',
        'service:currentUser',
        'service:status-messages',
        'service:ready',
    ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
    const controller = this.subject();
    assert.ok(controller);
});

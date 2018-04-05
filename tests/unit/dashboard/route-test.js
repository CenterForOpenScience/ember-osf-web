import { moduleFor, test } from 'ember-qunit';

moduleFor('route:dashboard', 'Unit | Route | dashboard', {
    // Specify the other units that are required for this test.
    needs: [
        'service:metrics',
        'service:session',
        'service:features',
        'service:analytics',
        'service:currentUser',
        'service:status-messages',
    ],
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});

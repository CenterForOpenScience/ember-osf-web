import { moduleFor, test } from 'ember-qunit';

moduleFor('route:application', 'Unit | Route | application', {
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

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});

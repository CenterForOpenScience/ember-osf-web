import { moduleFor, test } from 'ember-qunit';

moduleFor('route:quickfiles', 'Unit | Route | quickfiles', {
    needs: [
        'service:session',
        'service:currentUser',
        'service:metrics',
        'service:features',
        'service:analytics',
        'service:status-messages',
    ],
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});

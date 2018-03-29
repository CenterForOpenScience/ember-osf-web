import { moduleFor, test } from 'ember-qunit';

moduleFor('route:application', 'Unit | Route | application', {
    needs: [
        'service:session',
        'service:moment',
        'service:metrics',
        'service:features',
        'service:analytics',
        'service:currentUser',
        'service:ready',
    ],
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});

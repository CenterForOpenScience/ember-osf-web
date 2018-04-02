import { moduleFor, test } from 'ember-qunit';

moduleFor('route:guid-user/quickfiles', 'Unit | Route | guid-user/quickfiles', {
    needs: [
        'service:currentUser',
        'service:metrics',
        'service:features',
        'service:analytics',
        'service:session',
    ],
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});

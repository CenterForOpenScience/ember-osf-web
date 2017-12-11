import { moduleFor, test } from 'ember-qunit';

moduleFor('route:user-quickfiles', 'Unit | Route | user quickfiles', {
    needs: [
        'service:currentUser',
        'service:metrics',
    ],
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});

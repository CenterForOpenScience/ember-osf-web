import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:application', 'Unit | Controller | application', {
    needs: [
        'service:session',
        'service:metrics',
    ],
});

// Replace this with your real tests.
test('it exists', function(this: test, assert) {
    const controller = this.subject();
    assert.ok(controller);
});

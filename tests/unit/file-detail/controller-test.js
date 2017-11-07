import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:file-detail', 'Unit | Controller | file detail', {
    needs: [
        'service:currentUser',
        'service:toast',
    ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
    const controller = this.subject();
    assert.ok(controller);
});

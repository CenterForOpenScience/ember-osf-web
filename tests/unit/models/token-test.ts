import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | token', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const store = this.owner.lookup('service:store');
        const model = run(() => store.createRecord('token', {}));
        assert.ok(model);
    });
});

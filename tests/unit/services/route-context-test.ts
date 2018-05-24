import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | route-context', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const service = this.owner.lookup('service:route-context');
        assert.ok(service);
    });
});

import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Adapter | log', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:log');
        assert.ok(adapter);
    });
});

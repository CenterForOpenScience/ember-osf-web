import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Adapter | draft-registration', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:draft-registration');
        assert.ok(adapter);
    });
});

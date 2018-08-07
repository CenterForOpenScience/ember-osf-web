import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Adapter | user-registration', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:user-registration');
        assert.ok(adapter);
    });
});

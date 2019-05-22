import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Adapter | external-identity', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:external-identity');
        assert.ok(adapter);
    });
});

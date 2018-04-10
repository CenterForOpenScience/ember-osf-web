import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | status-messages', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const service = this.owner.lookup('service:status-messages');
        assert.ok(service);
    });
});

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | guid-node/addons/addon', function(hooks) {
    setupTest(hooks);

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:guid-node/addons/addon');
        assert.ok(route);
    });
});

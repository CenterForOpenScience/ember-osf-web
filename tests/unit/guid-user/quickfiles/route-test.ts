import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Route | guid-user/quickfiles', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:guid-user/quickfiles');
        assert.ok(route);
    });
});

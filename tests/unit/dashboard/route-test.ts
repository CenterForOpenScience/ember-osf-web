import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Route | dashboard', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:dashboard');
        assert.ok(route);
    });
});

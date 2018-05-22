import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Route | quickfiles', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:quickfiles');
        assert.ok(route);
    });
});

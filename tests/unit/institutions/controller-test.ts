import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Controller | institutions', hooks => {
    setupTest(hooks);
    test('it exists', function(assert) {
        const controller = this.owner.lookup('controller:institutions');
        assert.ok(controller);
    });
});

import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Controller | institutions', hooks => {
    setupTest(hooks);
    test('it exists', function(assert) {
        const controller = this.owner.lookup('controller:institutions');
        assert.ok(controller);
    });
});

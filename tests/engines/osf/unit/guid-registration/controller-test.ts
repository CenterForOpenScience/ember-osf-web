import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Unit | Controller | guid-registration', hooks => {
    setupEngineTest(hooks, 'osf');

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const controller = this.owner.lookup('controller:guid-registration');
        assert.ok(controller);
    });
});

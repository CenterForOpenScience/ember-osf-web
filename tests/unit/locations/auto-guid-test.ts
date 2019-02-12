import GuidAutoLocation from 'ember-osf-web/locations/auto';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Location | guid-auto ', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        assert.ok(this.owner.lookup('location:auto') instanceof GuidAutoLocation);
    });
});

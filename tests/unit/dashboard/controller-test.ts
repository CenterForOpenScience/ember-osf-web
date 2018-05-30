import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, skip } from 'qunit';

module('Unit | Controller | dashboard', hooks => {
    setupTest(hooks);

    skip('it exists', function(assert) {
        const controller = this.subject();
        // TODO: init calls out requests, need to mock them to have this pass
        assert.ok(controller);
    });
});

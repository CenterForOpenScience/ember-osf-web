import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import OsfModalState from 'osf-components/services/osf-modal-state';

module('Unit | Service | osf-modal-state', hooks => {
    setupTest(hooks);

    test('it handles dialog state', function(assert) {
        const service: OsfModalState = this.owner.lookup('service:osf-modal-state');

        assert.ok(!service.inModalState);
        service.enterModalState();
        assert.ok(service.inModalState);
        service.exitModalState();
        assert.ok(!service.inModalState);

        service.enterModalState();
        assert.throws(
            () => service.enterModalState(),
            'Throws error on double modal',
        );
    });
});

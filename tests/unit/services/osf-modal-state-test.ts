import { settled } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import OsfModalState from 'osf-components/services/osf-modal-state';

module('Unit | Service | osf-modal-state', hooks => {
    setupTest(hooks);

    test('it handles dialog state', async function(assert) {
        const service: OsfModalState = this.owner.lookup('service:osf-modal-state');

        assert.notOk(service.inModalState, 'Started in non-modal state');
        service.enterModalState();
        await settled(); // enterModalState schedules the change asynchronously
        assert.ok(service.inModalState, 'Entered modal state');
        service.exitModalState();
        await settled(); // exitModalState schedules the change asynchronously
        assert.notOk(service.inModalState, 'Exited modal state');

        service.enterModalState();
        await settled(); // enterModalState schedules the change asynchronously
        assert.throws(
            () => service.enterModalState(),
            'Throws error on double modal',
        );
    });
});

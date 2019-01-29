import { visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings/account | default region', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('it works', async assert => {
        server.create('region', { id: 'us', name: 'United States' });
        server.create('region', { id: 'au-1', name: 'Australia - Sydney' });
        const currentUser = server.create('user', 'loggedIn', 'withUsRegion');
        server.create(
            'user-setting',
            {
                user: currentUser,
            },
        );

        await visit('/settings/account');
        assert.dom('[data-test-default-region-panel]').exists();
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .exists();
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .hasText('United States');
        await selectChoose('[data-test-region-selector]', 'Australia - Sydney');
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .hasText('Australia - Sydney', 'Just chose Australia');
        await click('[data-test-update-region-button]');
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .hasText('Australia - Sydney', 'Saved change to Australia');
    });
});

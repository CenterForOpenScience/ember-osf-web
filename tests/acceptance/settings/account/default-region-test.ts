import { visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings/account | default region', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('it works', async assert => {
        server.loadFixtures('regions');
        server.create('user', 'loggedIn');

        await visit('/settings/account');
        assert.dom('[data-test-default-region-panel]').exists();
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .exists();
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .hasText('United States');
        selectChoose('[data-test-region-selector]', 'Australia - Syndey');
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .hasText('Australia - Sydney');
        await click('[data-test-update-region-button]');
        assert.dom('[data-test-region-selector] span[class~="ember-power-select-selected-item"]')
            .hasText('Australia - Sydney');
    });
});

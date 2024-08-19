import { currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | institutions | dashboard';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('institutions dashboard', async function(assert) {
        server.create('institution', {
            id: 'has-users',
        }, 'withMetrics');
        await visit('/institutions/has-users/dashboard');
        assert.equal(
            currentURL(),
            '/institutions/has-users/dashboard',
            "Still at '/institutions/has-users/dashboard'.",
        );

        assert.dom('[data-test-page-tab="summary"]').exists('Summary tab exists');
        assert.dom('[data-test-page-tab="users"]').exists('Users tab exists');
        assert.dom('[data-test-page-tab="projects"]').exists('Projects tab exists');
        assert.dom('[data-test-page-tab="registrations"]').exists('Regitrations tab exists');
        assert.dom('[data-test-page-tab="preprints"]').exists('Preprints tab exists');

        // Summary tab
        await percySnapshot(`${moduleName} - summary`);
        assert.dom('[data-test-page-tab="summary"]').hasClass('active', 'Summary tab is active by default');

        // Users tab
        await click('[data-test-page-tab="users"]');
        await percySnapshot(`${moduleName} - users`);
        assert.dom('[data-test-page-tab="users"]').hasClass('active', 'Users tab is active');

        // Projects tab
        await click('[data-test-page-tab="projects"]');
        await percySnapshot(`${moduleName} - projects`);
        assert.dom('[data-test-page-tab="projects"]').hasClass('active', 'Projects tab is active');

        // Registrations tab
        await click('[data-test-page-tab="registrations"]');
        await percySnapshot(`${moduleName} - registrations`);
        assert.dom('[data-test-page-tab="registrations"]').hasClass('active', 'Registrations tab is active');

        // Preprints tab
        await click('[data-test-page-tab="preprints"]');
        await percySnapshot(`${moduleName} - preprints`);
        assert.dom('[data-test-page-tab="preprints"]').hasClass('active', 'Preprints tab is active');
    });
});

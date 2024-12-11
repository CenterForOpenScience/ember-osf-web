import { currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | institutions | dashboard';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('institutions dashboard: page layout', async function(assert) {
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
        assert.dom('[data-test-summary-report-year-month]').exists('Report year month exists');

        // Users tab
        await click('[data-test-page-tab="users"]');
        await percySnapshot(`${moduleName} - users`);
        assert.dom('[data-test-page-tab="users"]').hasClass('active', 'Users tab is active');
        assert.dom('[data-test-link-to-reports-archive]').exists('Link to download prior reports exists');
        assert.dom('[data-test-download-dropdown]').exists('Link to download file formats');
        assert.dom('[data-test-user-report-year-month]').exists('User report year month exists');

        // Projects tab
        await click('[data-test-page-tab="projects"]');
        await percySnapshot(`${moduleName} - projects`);
        assert.dom('[data-test-page-tab="projects"]').hasClass('active', 'Projects tab is active');
        assert.dom('[data-test-link-to-reports-archive]').exists('Link to download prior reports exists');
        assert.dom('[data-test-download-dropdown]').exists('Link to download file formats');

        // Registrations tab
        await click('[data-test-page-tab="registrations"]');
        await percySnapshot(`${moduleName} - registrations`);
        assert.dom('[data-test-page-tab="registrations"]').hasClass('active', 'Registrations tab is active');
        assert.dom('[data-test-link-to-reports-archive]').exists('Link to download prior reports exists');
        assert.dom('[data-test-download-dropdown]').exists('Link to download file formats');

        // Preprints tab
        await click('[data-test-page-tab="preprints"]');
        await percySnapshot(`${moduleName} - preprints`);
        assert.dom('[data-test-page-tab="preprints"]').hasClass('active', 'Preprints tab is active');
        assert.dom('[data-test-link-to-reports-archive]').exists('Link to download prior reports exists');
        assert.dom('[data-test-download-dropdown]').exists('Link to download file formats');
    });

    test('institutions dashboard: projects, registrations, and preprints tab', async function(assert) {
        server.create('institution', {
            id: 'has-users',
        }, 'withMetrics');

        await visit('/institutions/has-users/dashboard');

        for (const tab of ['projects', 'registrations', 'preprints']) {
            await click(`[data-test-page-tab=${tab}]`);

            assert.dom(`[data-test-page-tab=${tab}]`).hasClass('active', `${tab} tab is active`);
            assert.dom('[data-test-object-list-table]').exists('Object list exists');
            assert.dom('[data-test-object-count]').exists('Object count exists');
            assert.dom('[data-test-toggle-filter-button]').exists('Filter button exists');
            assert.dom('[data-test-customize-columns-button]').exists('Customize columns button exists');
        }
    });
});


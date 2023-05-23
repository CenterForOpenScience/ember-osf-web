import { click as untrackedClick, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { module, test } from 'qunit';

import { click, currentURL, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | search | query-params';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('default query-parameters', async assert => {
        // Load search page
        await visit('/search');
        // assert object type nav is shown
        assert.dom('[data-test-topbar-object-type-nav]').exists('Object type nav shown in desktop view');
        assert.dom('[data-test-left-panel-object-type-dropdown]')
            .doesNotExist('Left-panel object type dropdown not shown in desktop view');
        // assert sort dropdown is shown
        assert.dom('[data-test-topbar-sort-dropdown]').exists('Sort dropdown shown in desktop view');
        assert.dom('[data-test-left-panel-sort-dropdown]')
            .doesNotExist('Left-panel sort dropdown not shown in desktop view');
        // assert default query-param values
        assert.equal(currentURL(), '/search', 'Default query-params are empty');
        assert.dom('[data-test-topbar-object-type-link="All"]').hasClass('active', 'All is the default object type');
        assert.dom('[data-test-topbar-sort-dropdown]').containsText('Relevance', 'Relevance is the default sort');
        // change object type
        await click('[data-test-topbar-object-type-link="Projects"]');
        assert.dom('[data-test-topbar-object-type-link="Projects"]').hasClass('active', 'Projects is selected');
        assert.dom('[data-test-topbar-object-type-link="All"]').doesNotHaveClass('active', 'All is not selected');
        assert.equal(currentURL(), '/search?resourceType=Projects', 'Query-params are updated');
        // change sort
        await clickTrigger('[data-test-topbar-sort-dropdown]');
        await untrackedClick('[data-option-index="2"]'); // date-createst, oldest
        assert.dom('[data-test-topbar-sort-dropdown]').containsText('Date created, oldest',
            'Date created, oldest first is selected');
        assert.equal(currentURL(), '/search?resourceType=Projects&sort=date_created', 'Query-params are updated');
    });

    test('default query-parameters, mobile', async assert => {
        setBreakpoint('mobile');
        // Load search page
        await visit('/search');
        // assert object type nav is shown
        await click('[data-test-toggle-side-panel]');
        assert.dom('[data-test-topbar-object-type-nav]').doesNotExist('Object type nav not shown in mobile view');
        assert.dom('[data-test-left-panel-object-type-dropdown]')
            .exists('Left-panel object type dropdown shown in mobile view');
        // assert sort dropdown is shown
        assert.dom('[data-test-topbar-sort-dropdown]').doesNotExist('Sort dropdown not shown in mobile view');
        assert.dom('[data-test-left-panel-sort-dropdown]')
            .exists('Left-panel sort dropdown shown in mobile view');
        // assert default query-param values
        assert.equal(currentURL(), '/search', 'Default query-params are empty');
        assert.dom('[data-test-left-panel-object-type-dropdown]').containsText('All', 'All is the default object type');
        assert.dom('[data-test-left-panel-sort-dropdown]').containsText('Relevance', 'Relevance is the default sort');
        // change object type
        await clickTrigger('[data-test-left-panel-object-type-dropdown]');
        await untrackedClick('[data-option-index="2"]'); // Registrations
        assert.equal(currentURL(), '/search?resourceType=Registrations', 'Object type query-param updated');
        // change sort
        await clickTrigger('[data-test-left-panel-sort-dropdown]');
        await untrackedClick('[data-option-index="4"]'); // date-modified, oldest
        assert.equal(currentURL(), '/search?resourceType=Registrations&sort=date_modified', 'Query-params are updated');
    });

    test('query-parameters from url', async assert => {
        await visit('/search?resourceType=Preprints&sort=-date_modified');
        assert.dom('[data-test-topbar-object-type-link="Preprints"]')
            .hasClass('active', 'Desktop: Active object type filter selected from url');
        assert.dom('[data-test-topbar-sort-dropdown]')
            .containsText('Date modified, newest', 'Desktop: Active sort selected from url');

        setBreakpoint('mobile');
        await click('[data-test-toggle-side-panel]');
        assert.dom('[data-test-left-panel-object-type-dropdown]')
            .containsText('Preprints', 'Mobile: Active object type filter selected from url');
        assert.dom('[data-test-left-panel-sort-dropdown]')
            .containsText('Date modified, newest', 'Mobile: Active sort selected from url');
    });
});

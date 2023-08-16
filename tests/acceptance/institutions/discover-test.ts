import { currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { module, skip } from 'qunit';
import { click, setupOSFApplicationTest} from 'ember-osf-web/tests/helpers';

module('Acceptance | institutions | discover', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    skip('Desktop: Default colors', async assert => {
        server.create('institution', {
            id: 'has-users',
        }, 'withMetrics');
        await visit('/institutions/has-users');
        // verify institutions route
        assert.equal(currentURL(), '/institutions/has-users', 'Current route is institutions discover');
        assert.dom('[data-test-heading-wrapper]').exists('Institutions heading wrapper shown');
        // verify banner and description
        assert.dom('[data-test-institution-banner]').exists('Institution banner shown');
        assert.dom('[data-test-institution-description]').exists('Institution description shown');
        // verify topbar and sort dropdown
        assert.dom('[data-test-topbar-wrapper]').exists('Topbar not shown on mobile');
        assert.dom('[data-test-topbar-sort-dropdown]').exists('Sort dropdown shown on desktop');
        await percySnapshot(assert);
    });

    skip('Mobile: Default colors', async assert => {
        setBreakpoint('mobile');
        server.create('institution', {
            id: 'has-users',
        }, 'withMetrics');
        // verify institutions route
        await visit('/institutions/has-users');
        assert.equal(currentURL(), '/institutions/has-users', 'Current route is institutions discover');
        // verify logo and description
        assert.dom('[data-test-institution-logo]').exists('Institution header logo shown');
        assert.dom('[data-test-institution-description]').exists('Institution description is shown');
        // verify mobile menu display
        assert.dom('[data-test-topbar-wrapper]').doesNotExist('Topbar not shown on mobile');
        assert.dom('[data-test-toggle-side-panel]').exists('Institution header logo shown');
        await click('[data-test-toggle-side-panel]');
        // verify resource type and sort by dropdown
        assert.dom('[data-test-left-panel-object-type-dropdown]').exists('Mobile resource type dropdown is shown');
        assert.dom('[data-test-left-panel-sort-dropdown]').exists('Mobile sort by dropdown is shown');
        await percySnapshot(assert);
    });
});

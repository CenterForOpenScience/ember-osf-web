import { currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { module, test } from 'qunit';
import { click, setupOSFApplicationTest} from 'ember-osf-web/tests/helpers';

module('Acceptance | institutions | discover', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('Desktop: Default OSF colors', async assert => {
        server.create('institution', {
            id: 'default-colors',
            assets: {
                primary_color: '',
                secondary_color: '',
            },
        }, 'withMetrics');
        await visit('/institutions/default-colors');
        // verify institutions route
        assert.equal(currentURL(), '/institutions/default-colors', 'Current route is institutions discover');
        assert.dom('[data-test-heading-wrapper-institutions]').exists('Institutions heading wrapper shown');
        // verify banner and description
        assert.dom('[data-test-institution-banner]').exists('Institution banner shown');
        assert.dom('[data-test-institution-description]').exists('Institution description shown');
        // verify topbar and sort dropdown
        assert.dom('[data-test-topbar-object-type-nav]').exists('Topbar shown');
        assert.dom('[ data-test-topbar-sort-dropdown]').exists('Sort dropdown shown on desktop');
        // verify default OSF colors
        assert.dom('[data-test-heading-wrapper-institutions]').hasAttribute('style', 'background-color: #214661;');
        assert.dom('[data-test-institution-description]').hasAttribute('style', 'color: #fff;');
        await percySnapshot(assert);
    });

    test('Desktop: Primary and secondary colors', async assert => {
        server.create('institution', {
            id: 'mock-up',
        }, 'withMetrics');
        await visit('/institutions/mock-up');
        // verify institutions route
        assert.equal(currentURL(), '/institutions/mock-up', 'Current route is institutions discover');
        assert.dom('[data-test-heading-wrapper-institutions]').exists('Institutions heading wrapper shown');
        // verify banner and description
        assert.dom('[data-test-institution-banner]').exists('Desktop: Institution banner is shown');
        assert.dom('[data-test-institution-description]').exists('Institution description is shown');
        assert.dom('[data-test-institution-description]').hasText(
            `In partnership with the University of Virginia Library Scholarly Communication Services & 
            Research Data Services, Vice President for Research, School of Data Science, and the Health Sciences 
            Library. Projects must abide by the University Security and Data Protection Policies.`,
        );
        // verify primary and secondary colors
        assert.dom('[data-test-heading-wrapper-institutions]').hasAttribute('style', 'background-color: #0c275c;');
        assert.dom('[data-test-institution-description]').hasAttribute('style', 'color: #fff;');
        await percySnapshot(assert);
    });

    test('Mobile', async assert => {
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
        assert.dom('[data-test-topbar-object-type-nav]').doesNotExist('Topbar not shown on mobile');
        assert.dom('[data-test-toggle-side-panel]').exists('Institution header logo shown');
        await click('[data-test-toggle-side-panel]');
        assert.dom('[data-test-left-panel-object-type-dropdown]').exists('Mobile resource type dropdown is shown');
        assert.dom('[data-test-left-panel-sort-dropdown]').exists('Mobile sort by dropdown is shown');
        assert.dom('[data-test-active-filters-list]').exists('Institution description is shown');
        await percySnapshot(assert);
    });
});

import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | institutions | dashboard | -components | total-count-kpi-wrapper', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const model = Object({
            summaryMetrics: {
                publicProjectCount: 10,
                privateProjectCount: 10,
                userCount: 10,
                publicRegistrationCount: 100,
                publishedPreprintCount: 1000,
                embargoedRegistrationCount: 200,
                storageByteCount: 104593230,
                publicFileCount: 1567,
                monthlyLoggedInUserCount: 300,
                monthlyActiveUserCount:40,
                convertedStorageCount: '104 GB',
            },
        });

        this.set('model', model);
    });

    test('it renders the dashboard total kpis correctly', async assert => {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::TotalCountKpiWrapper
@model={{this.model}}
/>
`);

        let parentContainer = '[data-test-total-count-kpi="0"]';
        // Then the total users kpi is tested
        assert.dom(parentContainer)
            .exists('The User Widget exists');
        assert.dom(parentContainer)
            .hasText('10 Total Users');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'users');

        // And the total logged in user kpi is tested
        parentContainer = '[data-test-total-count-kpi="1"]';
        assert.dom(parentContainer)
            .exists('The Total Monthly Logged in Users Widget exists');
        assert.dom(parentContainer)
            .hasText('300 Total Monthly Logged in Users');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'users');

        // And the total active in user kpi is tested
        parentContainer = '[data-test-total-count-kpi="2"]';
        assert.dom(parentContainer)
            .exists('The Total Monthly Active Users Widget exists');
        assert.dom(parentContainer)
            .hasText('40 Total Monthly Active Users');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'users');

        // And the total project kpi is tested
        parentContainer = '[data-test-total-count-kpi="3"]';
        assert.dom(parentContainer)
            .exists('The Project Widget exists');
        assert.dom(parentContainer)
            .hasText('20 OSF Public and Private Projects');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'flask');

        // And the total registration kpi is tested
        parentContainer = '[data-test-total-count-kpi="4"]';
        assert.dom(parentContainer)
            .exists('The Total Registration Widget exists');
        assert.dom(parentContainer)
            .hasText('300 OSF Public and Embargoed Registrations');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'archive');

        // And the total preprint kpi is tested
        parentContainer = '[data-test-total-count-kpi="5"]';
        assert.dom(parentContainer)
            .exists('The Total Preprint Widget exists');
        assert.dom(parentContainer)
            .hasText('1000 OSF Preprints');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'file-alt');

        // And the total file count kpi is tested
        parentContainer = '[data-test-total-count-kpi="6"]';
        assert.dom(parentContainer)
            .exists('The Total File Widget exists');
        assert.dom(parentContainer)
            .hasText('1567 Total Public File Count');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'file-alt');

        // And the total storage kpi is tested
        parentContainer = '[data-test-total-count-kpi="7"]';
        assert.dom(parentContainer)
            .exists('The Total Storage Widget exists');
        assert.dom(parentContainer)
            .hasText('104 Total Storage in GB');
        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'database');

        // Finally there are only 8 widgets
        assert.dom('[data-test-total-count-kpi="8"]')
            .doesNotExist('There are only 8 widgets');
    });
});

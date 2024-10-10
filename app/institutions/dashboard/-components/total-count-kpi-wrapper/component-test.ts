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
                preprintCount: 1000,
                embargoedRegistrationCount: 200,
                storageByteCount: 104593230,
                publicFileCount: 1567,
                monthlyLoggedInUserCount: 300,
                monthlyActiveUserCount:40,
                convertedStorageCount: 104,
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

        // Then the first total kpi is tested
        assert.dom('[data-test-total-count-kpi="0"]')
            .exists('The User Widget exists');

        assert.dom('[data-test-total-count-kpi="0"]')
            .hasText('10 Total Users');

        assert.dom('[data-test-total-count-kpi="0"] [data-test-kpi-icon]')
            .hasAttribute('data-icon', 'users');

        // And the second total kpi is tested
        assert.dom('[data-test-total-count-kpi="1"]')
            .exists('The Project Widget exists');

        assert.dom('[data-test-total-count-kpi="1"]')
            .hasText('20 OSF Public and Private Projects');

        assert.dom('[data-test-total-count-kpi="1"] [data-test-kpi-icon]')
            .hasAttribute('data-icon', 'flask');

        // And the third total kpi is tested
        assert.dom('[data-test-total-count-kpi="2"]')
            .exists('The Registration Widget exists');

        assert.dom('[data-test-total-count-kpi="2"]')
            .hasText('100 OSF Registrations');

        assert.dom('[data-test-total-count-kpi="2"] [data-test-kpi-icon]')
            .hasAttribute('data-icon', 'archive');

        // And the fourth total kpi is tested
        let parentContainer = '[data-test-total-count-kpi="3"]';
        assert.dom(parentContainer)
            .exists('The Preprint Widget exists');

        assert.dom(parentContainer)
            .hasText('1000 OSF Preprints');

        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'file-alt');

        // And the total storage kpi is tested
        parentContainer = '[data-test-total-count-kpi="4"]';
        assert.dom(parentContainer)
            .exists('The Total Storage Widget exists');

        assert.dom(parentContainer)
            .hasText('104 Total Storage');

        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'database');

        // And the total file count kpi is tested
        parentContainer = '[data-test-total-count-kpi="5"]';
        assert.dom(parentContainer)
            .exists('The Total File Widget exists');

        assert.dom(parentContainer)
            .hasText('1567 Total Public File Count');

        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'file-alt');

        // And the total logged in users kpi is tested
        parentContainer = '[data-test-total-count-kpi="6"]';
        assert.dom(parentContainer)
            .exists('The Total Monthly Logged in Users Widget exists');

        assert.dom(parentContainer)
            .hasText('300 Total Monthly Logged in Users');

        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'users');

        // And the total active users kpi is tested
        parentContainer = '[data-test-total-count-kpi="7"]';
        assert.dom(parentContainer)
            .exists('The Total Active Usesrs Widget exists');

        assert.dom(parentContainer)
            .hasText('40 Total Monthly Active Users');

        assert.dom(`${parentContainer} [data-test-kpi-icon]`)
            .hasAttribute('data-icon', 'users');

        // Finally there are only 8 widgets
        assert.dom('[data-test-total-count-kpi="8"]')
            .doesNotExist('There are only 8 widgets');
    });
});

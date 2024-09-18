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
                userCount: 10,
                privateProjectCount: 10,
                publicProjectCount: 10,
                publicRegistrationCount: 100,
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
            .hasAttribute('data-icon', 'building');

        // And the second total kpi is tested
        assert.dom('[data-test-total-count-kpi="1"]')
            .exists('The Project Widget exists');

        assert.dom('[data-test-total-count-kpi="1"]')
            .hasText('20 OSF Public and Private Projects');

        assert.dom('[data-test-total-count-kpi="1"] [data-test-kpi-icon]')
            .hasAttribute('data-icon', 'atom');

        // And the third total kpi is tested
        assert.dom('[data-test-total-count-kpi="2"]')
            .exists('The Registration Widget exists');

        assert.dom('[data-test-total-count-kpi="2"]')
            .hasText('100 OSF Registrations');

        assert.dom('[data-test-total-count-kpi="2"] [data-test-kpi-icon]')
            .hasAttribute('data-icon', 'flag');

        // And the fourth total kpi is tested
        assert.dom('[data-test-total-count-kpi="3"]')
            .exists('The Preprint Widget exists');

        assert.dom('[data-test-total-count-kpi="3"]')
            .hasText('10000 OSF Preprints');

        assert.dom('[data-test-total-count-kpi="3"] [data-test-kpi-icon]')
            .hasAttribute('data-icon', 'file-alt');

        // Finally there are only 4 widgets
        assert.dom('[data-test-total-count-kpi="4"]')
            .doesNotExist('There are only 4 widgets');
    });
});

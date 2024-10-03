import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | institutions | dashboard | -components | total-count-chart-wrapper', hooks => {
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
                preprintCount: 1000,
            },
        });

        this.set('model', model);
    });

    test('it renders the dashboard total charts correctly', async assert => {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);

        // Then the first total chart is tested
        assert.dom('[data-test-total-count-chart="0"]')
            .exists('The User Chart exists');

        assert.dom('[data-test-total-count-chart="0"]')
            // eslint-disable-next-line max-len
            .hasText('Total Users');

        // And the second total chart is tested
        assert.dom('[data-test-total-count-chart="1"]')
            .exists('The Project Widget exists');

        assert.dom('[data-test-total-count-chart="1"]')
            // eslint-disable-next-line max-len
            .hasText('OSF Public and Private Projects');

        // And the third total chart is tested
        assert.dom('[data-test-total-count-chart="2"]')
            .exists('The Registration Widget exists');

        assert.dom('[data-test-total-count-chart="2"]')
            // eslint-disable-next-line max-len
            .hasText('OSF Registrations');

        // And the fourth total chart is tested
        assert.dom('[data-test-total-count-chart="3"]')
            .exists('The Preprint Widget exists');

        assert.dom('[data-test-total-count-chart="3"]')
            // eslint-disable-next-line max-len
            .hasText('OSF Preprints');

        // Finally there are only 4 widgets
        assert.dom('[data-test-total-count-chart="4"]')
            .doesNotExist('There are only 4 widgets');
    });
});

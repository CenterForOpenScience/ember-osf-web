import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | institutions | dashboard | -components | chart-kpi', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const data = Object({
            title: 'This is the title',
            chartData: [
                Object({
                    label: 'a very long data set title that needs to be handled',
                    total: 100000,
                }),
            ],
            chartType: 'pie',
        });

        this.set('data', data);
    });

    test('it renders the data correctly', async assert => {

        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper::ChartKpi
    @data={{this.data}}
/>
`);
        // Then the chart is verified
        assert.dom('[data-test-chart]')
            .exists('The test chart exists');

        // And the title is verified
        assert.dom('[data-test-chart-title]')
            .hasText('This is the title');

        assert.dom('[data-test-toggle-icon]')
            .hasAttribute('data-icon', 'caret-down');

        // Finally the expanded data is not visible
        assert.dom('[data-test-expansion-data]')
            .hasStyle({display: 'none'});
    });

    test('it renders the expanded data correctly', async assert => {

        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper::ChartKpi
    @data={{this.data}}
/>
`);
        // When I click the expanded icon
        await click('[data-test-expand-additional-data]');

        // Then I verify the icon has changed
        assert.dom('[data-test-toggle-icon]')
            .hasAttribute('data-icon', 'caret-up');

        // And the expanded data is visible
        assert.dom('[data-test-expansion-data]')
            .exists('The expansion data is visible');

        // And the expanded data position 0 color is verified
        assert.dom('[data-test-expanded-color="0"]')
            .hasAttribute('style', 'background-color:#00D1FF');

        // And the expanded data position 0 name is verified
        assert.dom('[data-test-expanded-name="0"]')
            .hasText('a very long data set title that needs to be handled');

        // And the expanded data position 0 total is verified
        assert.dom('[data-test-expanded-total="0"]')
            .hasText('100000');
    });
});

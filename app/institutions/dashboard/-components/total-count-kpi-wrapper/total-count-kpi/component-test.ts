import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { EnginesIntlTestContext } from 'ember-engines/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | institutions | dashboard | -components | total-count-kpi', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const data = Object({
            total: 200,
            title: 'This is the title',
            icon: 'building',
        });

        this.set('data', data);
    });

    test('it renders the data correctly', async assert => {

        await render(hbs`
<Institutions::Dashboard::-Components::TotalCountKpiWrapper::TotalCountKpi
    @data={{this.data}}
/>
`);

        assert.dom('[data-test-kpi-title]')
            .hasText('This is the title');
        assert.dom('[data-test-kpi-data]')
            .hasText('200');
        assert.dom('[data-test-kpi-icon]')
            .hasAttribute('data-icon', 'building');
    });

    test('it renders the without data correctly', async function(this: EnginesIntlTestContext, assert) {
        const data = Object({
            total: 0,
            title: 'This is the title',
            icon: 'building',
        });

        this.set('data', data);


        await render(hbs`
<Institutions::Dashboard::-Components::TotalCountKpiWrapper::TotalCountKpi
    @data={{this.data}}
/>
`);

        assert.dom('[data-test-kpi-title]')
            .hasText('This is the title');
        assert.dom('[data-test-kpi-data]')
            .hasText('No data for institution found.');
        assert.dom('[data-test-kpi-icon]')
            .hasAttribute('data-icon', 'building');
    });
});

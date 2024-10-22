import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | institutions | dashboard | -components | kpi-chart-wrapper', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const model = Object({
            summaryMetrics: {
                userCount: 10,
                privateProjectCount: 15,
                publicProjectCount: 20,
                publicRegistrationCount: 100,
                embargoedRegistrationCount: 200,
                preprintCount: 1000,
                storageByteCount: 2000,
            },
            departmentMetrics: [
                {
                    name: 'Math',
                    numberOfUsers: 25,
                },
                {
                    name: 'Science',
                    numberOfUsers: 37,
                },
            ],
            institution: {
                iris: ['bleh'],
            },
        });

        this.set('model', model);
    });

    test('it calculates the Total Users by Department data correctly', async function(assert) {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);
        const parentDom = '[data-test-kpi-chart="0"]';
        // When I click the expanded icon
        await click(`${parentDom} [data-test-expand-additional-data]`);

        // And the title is verified
        assert.dom(`${parentDom} [data-test-chart-title]`)
            .hasText('Total Users by Department');

        // And the expanded data position 0 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="0"]`)
            .hasText('Math');

        // And the expanded data position 0 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="0"]`)
            .hasText('25');

        // And the expanded data position 1 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="1"]`)
            .hasText('Science');

        // And the expanded data position 1 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="1"]`)
            .hasText('37');

        // Finally there are only 2 expanded data points
        assert.dom(`${parentDom} [data-test-expanded-name="2"]`)
            .doesNotExist();
    });

    test('it calculates the Public vs Private Project data correctly', async function(assert) {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);
        const parentDom = '[data-test-kpi-chart="1"]';

        // When I click the expanded icon
        await click(`${parentDom} [data-test-expand-additional-data]`);

        // And the title is verified
        assert.dom(`${parentDom} [data-test-chart-title]`)
            .hasText('Public vs Private Projects');

        // And the expanded data position 0 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="0"]`)
            .hasText('Public Projects');

        // And the expanded data position 0 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="0"]`)
            .hasText('20');

        // And the expanded data position 1 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="1"]`)
            .hasText('Private Projects');

        // And the expanded data position 1 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="1"]`)
            .hasText('15');

        // Finally there are only 2 expanded data points
        assert.dom(`${parentDom} [data-test-expanded-name="2"]`)
            .doesNotExist();
    });

    test('it calculates the Public vs Private Registration data correctly', async function(assert) {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);
        const parentDom = '[data-test-kpi-chart="2"]';

        // When I click the expanded icon
        await click(`${parentDom} [data-test-expand-additional-data]`);

        // And the title is verified
        assert.dom(`${parentDom} [data-test-chart-title]`)
            .hasText('Public vs Private Registrations');

        // And the expanded data position 0 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="0"]`)
            .hasText('Public Registrations');

        // And the expanded data position 0 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="0"]`)
            .hasText('100');

        // And the expanded data position 1 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="1"]`)
            .hasText('Private Registrations');

        // And the expanded data position 1 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="1"]`)
            .hasText('200');

        // Finally there are only 2 expanded data points
        assert.dom(`${parentDom} [data-test-expanded-name="2"]`)
            .doesNotExist();
    });

    test('it calculates the Total Objects data correctly', async function(assert) {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);
        const parentDom = '[data-test-kpi-chart="3"]';

        // When I click the expanded icon
        await click(`${parentDom} [data-test-expand-additional-data]`);

        // And the title is verified
        assert.dom(`${parentDom} [data-test-chart-title]`)
            .hasText('Total OSF Objects');

        // And the expanded data position 0 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="0"]`)
            .hasText('Preprints');

        // And the expanded data position 0 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="0"]`)
            .hasText('1000');

        // And the expanded data position 1 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="1"]`)
            .hasText('Public Projects');

        // And the expanded data position 1 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="1"]`)
            .hasText('20');

        // And the expanded data position 2 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="2"]`)
            .hasText('Private Projects');

        // And the expanded data position 2 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="2"]`)
            .hasText('15');

        // And the expanded data position 3 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="3"]`)
            .hasText('Public Registrations');

        // And the expanded data position 3 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="3"]`)
            .hasText('100');

        // And the expanded data position 4 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="4"]`)
            .hasText('Private Registrations');

        // And the expanded data position 4 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="4"]`)
            .hasText('200');

        // Finally there are only 5 expanded data points
        assert.dom(`${parentDom} [data-test-expanded-name="5"]`)
            .doesNotExist();
    });

    test('it calculates the Licenses data correctly', async function(assert) {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);
        const parentDom = '[data-test-kpi-chart="4"]';
        // When I click the expanded icon
        await click(`${parentDom} [data-test-expand-additional-data]`);

        // And the title is verified
        assert.dom(`${parentDom} [data-test-chart-title]`)
            .hasText('Licenses');

        // And the expanded data position 0 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="0"]`)
            .exists();

        // And the expanded data position 0 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="0"]`)
            .hasText('3');

        // And the expanded data position 1 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="1"]`)
            .exists();

        // And the expanded data position 1 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="1"]`)
            .hasText('2');

        assert.dom(`${parentDom} [data-test-expanded-total="2"]`)
            .doesNotExist();
    });

    test('it calculates the Addon data correctly', async function(assert) {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);
        const parentDom = '[data-test-kpi-chart="5"]';
        // When I click the expanded icon
        await click(`${parentDom} [data-test-expand-additional-data]`);

        // And the title is verified
        assert.dom(`${parentDom} [data-test-chart-title]`)
            .hasText('Add-ons');

        // And the expanded data position 0 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="0"]`)
            .exists();

        // And the expanded data position 0 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="0"]`)
            .hasText('3');

        // And the expanded data position 1 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="1"]`)
            .exists();

        // And the expanded data position 1 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="1"]`)
            .hasText('2');

        // Finally there are only 2 expanded data points
        assert.dom(`${parentDom} [data-test-expanded-name="2"]`)
            .doesNotExist();
    });

    test('it calculates the Storage Regions data correctly', async function(assert) {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);
        const parentDom = '[data-test-kpi-chart="6"]';
        // When I click the expanded icon
        await click(`${parentDom} [data-test-expand-additional-data]`);

        // And the title is verified
        assert.dom(`${parentDom} [data-test-chart-title]`)
            .hasText('Storage Regions');

        // And the expanded data position 0 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="0"]`)
            .exists();

        // And the expanded data position 0 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="0"]`)
            .hasText('3');

        // And the expanded data position 1 name is verified
        assert.dom(`${parentDom} [data-test-expanded-name="1"]`)
            .exists();

        // And the expanded data position 1 total is verified
        assert.dom(`${parentDom} [data-test-expanded-total="1"]`)
            .hasText('2');

        // Finally there are only 2 expanded data points
        assert.dom(`${parentDom} [data-test-expanded-name="2"]`)
            .doesNotExist();
    });

    test('it renders the dashboard total charts correctly', async assert => {
        // Given the component is rendered
        await render(hbs`
<Institutions::Dashboard::-Components::ChartKpiWrapper
@model={{this.model}}
/>
`);

        // Then there are only 8 charts
        assert.dom('[data-test-kpi-chart="8"]')
            .doesNotExist('There are only 8 charts');
    });
});

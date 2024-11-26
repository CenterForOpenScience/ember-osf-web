import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';

module('Integration | institutions | dashboard | -components | object-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        const columns = [
            {
                name: 'Title',
                sortKey: 'title',
                getValue: () => 'Title of some object',
            },
            {
                name: 'Description',
                getValue: () => 'Description of some object',
            },
            {
                name: 'Contributors',
                type: 'contributors',
            },
            {
                name: 'DOI',
                type: 'doi',
            },
        ];
        const institution = server.create('institution', {
            id: 'my-institution',
        });
        const defaultQueryOptions = {
            cardSearchFilter: {
                resourceType: 'Project,ProjectComponent',
            },
        };
        this.setProperties({
            columns,
            institution,
            defaultQueryOptions,
            objectType: 'thingies',
        });
    });

    test('the table headers are correct', async function(assert) {
        await render(hbs`
<Institutions::Dashboard::-Components::ObjectList
    @columns={{this.columns}}
    @institution={{this.institution}}
    @defaultQueryOptions={{this.defaultQueryOptions}}
    @objectType={{this.objectType}}
/>
        `);

        // Elements from InstitutionDashboarWrapper are present
        assert.dom('[data-test-page-tab="summary"]').exists('Summary tab exists');

        // Elements in the top bar are present
        assert.dom('[data-test-object-count]').containsText('10 total thingies', 'Object count is correct');
        assert.dom('[data-test-toggle-filter-button]').exists('Filter button exists');
        assert.dom('[data-test-customize-columns-button]').exists('Columns button exists');

        assert.dom('[data-test-object-list-table]').exists('Object list exists');

        // The table headers are correct
        assert.dom('[data-test-column-header]').exists({ count: 4 }, 'There are 4 columns');
        assert.dom('[data-test-column-header="Title"]').containsText('Title');
        assert.dom('[data-test-column-header="Title"] [data-test-sort="title"]').exists('Title is sortable');
        assert.dom('[data-test-column-header="Description"]').containsText('Description');
        assert.dom('[data-test-column-header="Description"] [data-test-sort="description"]')
            .doesNotExist('Description is not sortable');

        // The table data is not blatantly incorrect
        assert.dom('[data-test-object-table-body-row]').exists({ count: 10 }, 'There are 10 rows');

        // Download buttons are present
        await click('[data-test-download-dropdown]');
        assert.dom('[data-test-download-csv-link]').exists('CSV download link exists');
        assert.dom('[data-test-download-tsv-link]').exists('TSV download link exists');
    });

    test('the table supports filtering', async function(assert) {
        await render(hbs`
<Institutions::Dashboard::-Components::ObjectList
    @columns={{this.columns}}
    @institution={{this.institution}}
    @defaultQueryOptions={{this.defaultQueryOptions}}
    @objectType={{this.objectType}}
/>
        `);

        await click('[data-test-toggle-filter-button]');

        assert.dom('[data-test-filter-facet-toggle]').exists({ count: 3 }, '3 filters available');

        // Open the filter facet and load the values and select the first filter value
        await click('[data-test-filter-facet-toggle]');
        await click('[data-test-filter-facet-value] button');

        assert.dom('[data-test-active-filter]').exists({ count: 1 }, '1 filter active');
        assert.dom('[data-test-remove-active-filter]').exists('Remove filter button exists');

        await click('[data-test-remove-active-filter]');
        assert.dom('[data-test-active-filter]').doesNotExist('Filter removed');
    });

    test('the table supports customizing columns', async function(assert) {
        await render(hbs`
<Institutions::Dashboard::-Components::ObjectList
    @columns={{this.columns}}
    @institution={{this.institution}}
    @defaultQueryOptions={{this.defaultQueryOptions}}
    @objectType={{this.objectType}}
/>
        `);

        assert.dom('[data-test-column-header]').exists({ count: 4 }, '4 columns available');
        const titleColumn = document.querySelector('[data-test-column-header="Title"]');
        assert.ok(titleColumn, 'Title column is visible');

        // Open the column customization menu
        await click('[data-test-customize-columns-button]');
        assert.dom('[data-test-column-toggle-input]').exists({ count: 4 }, '4 columns available to show/hide');
        assert.dom('[data-test-column-toggle-input="Title"]').isChecked('Title column checkbox is checked');
        assert.dom('[data-test-column-toggle-input="Description"]').isChecked('Description column checkbox is checked');

        // Toggle off the first column
        await click('[data-test-column-toggle-input="Title"]');
        assert.ok(titleColumn, 'Title column still visible after toggling off');

        // Save changes
        await click('[data-test-save-columns-button]');
        assert.dom('[data-test-column-toggle-input]').doesNotExist('Column toggle menu hidden');
        assert.dom('[data-test-column-header="Title"]').doesNotExist('Title column removed');
        assert.dom('[data-test-column-header]').exists({ count: 3 }, '3 columns available');

        // Open the menu again
        await click('[data-test-customize-columns-button]');
        assert.dom('[data-test-column-toggle-input]').exists({ count: 4 }, 'Column toggle menu reopened');
        assert.dom('[data-test-column-toggle-input="Title"]').isNotChecked('Title column checkbox is not checked');
        assert.dom('[data-test-column-toggle-input="Description"]')
            .isChecked('Description column checkbox is still checked');

        // Toggle off all columns, but reset
        await click('[data-test-column-toggle-input="Description"]');
        await click('[data-test-column-toggle-input="Contributors"]');
        await click('[data-test-column-toggle-input="DOI"]');
        await click('[data-test-reset-columns-button]');
        assert.dom('[data-test-column-toggle-input]').doesNotExist('Column toggle menu hidden');
        assert.dom('[data-test-column-header]').exists({ count: 3 }, '3 columns available, as we did not save changes');

        // Open the menu again
        await click('[data-test-customize-columns-button]');
        assert.dom('[data-test-column-toggle-input]').exists({ count: 4 }, 'Column toggle menu reopened');
        assert.dom('[data-test-column-toggle-input="Title"]').isNotChecked('Title column checkbox is not checked');
        assert.dom('[data-test-column-toggle-input="Description"]')
            .isChecked('Description column checkbox is still checked');

        // Toggle title back on
        await click('[data-test-column-toggle-input="Title"]');
        await click('[data-test-save-columns-button]');
        assert.ok(titleColumn, 'Title column visible again');
    });
});

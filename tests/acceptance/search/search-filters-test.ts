import { click as untrackedClick, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { module, test } from 'qunit';


const moduleName = 'Acceptance | search | filters';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('add and remove search filters', async function(assert) {
        // Load search page
        await visit('/search');
        // assert there are search filters after initial search
        assert.dom('[data-test-filter-facet]').exists({ count: 3 }, 'Filterable properties shown after initial search');
        // assert that mobile only side panel toggle is not shown
        assert.dom('[data-test-toggle-side-panel]').doesNotExist('Side panel toggle not shown in desktop view');
        // assert there are no active filters
        assert.dom('[data-test-active-filter]').doesNotExist('No active filters shown initially');
        // expand a filterable property
        await click('[data-test-filter-facet-toggle="License"]');
        // ensure there are filter options
        assert.dom('[data-test-filter-facet-value]')
            .exists({ count: 2 }, 'Filter options shown after expanding a filterable property');
        // click on a filter option
        await click('[data-test-filter-facet-value] button');
        // assert there is one active filter
        assert.dom('[data-test-active-filter]')
            .exists({ count: 1 }, 'Active filter shown after clicking a filter option');
        // remove the active filter
        await click('[data-test-remove-active-filter]');
    });

    test('add a search filter using the see-more modal', async function(assert) {
        // Load search page
        await visit('/search');
        // assert there are no search filters
        assert.dom('[data-test-filter-facet]').exists({ count: 3 }, 'Filterable properties shown after initial search');
        // click the first filterable property
        await click('[data-test-filter-facet-toggle="License"]');
        // open the see-more modal
        await click('[data-test-see-more-filterable-values]');
        assert.dom('[data-test-see-more-dialog-heading]').containsText('License', 'See more modal shown');
        assert.dom('[data-test-property-value-select]')
            .containsText('Search for a filter to apply', 'Placeholder message shown in select');
        assert.dom('[data-test-see-more-dialog-apply-button]').isDisabled('Apply button disabled initially');
        // select a filter value
        await clickTrigger('[data-test-dialog]');
        await untrackedClick('[data-option-index="0"]');
        assert.dom('[data-test-see-more-dialog-apply-button]')
            .isNotDisabled('Apply button enabled after selecting a filter');
        // apply the filter
        await click('[data-test-see-more-dialog-apply-button]');
        assert.dom('[data-test-see-more-dialog-heading]').doesNotExist('See more modal closed after applying filter');
        assert.dom('[data-test-active-filter]').exists({ count: 1 }, 'Active filter shown after applying filter');
    });
});

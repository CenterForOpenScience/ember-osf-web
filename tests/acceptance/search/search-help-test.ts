import { click, currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';
import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import { EnginesIntlTestContext } from 'ember-engines/test-support';

module('Integration | Component | Search help', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('ember popover renders', async function(this: EnginesIntlTestContext, assert) {
        await visit('/search');
        assert.equal(currentURL(), '/search');

        // start help tutorial
        assert.dom('[data-test-start-help]').exists();
        await click('[data-test-start-help]');

        // verify first popover displays
        assert.dom('[data-test-search-help-1]').exists();
        // verify skip button present
        assert.dom('[data-test-help-skip-1]').exists();
        assert.dom('[data-test-help-skip-1]').hasText('Skip');
        // verify next button works
        assert.dom('[data-test-help-next-1]').exists();
        assert.dom('[data-test-help-next-1]').hasText('Next');
        // verify first popover content
        assert.dom('[data-test-help-heading-1]').exists();
        assert.dom('[data-test-help-heading-1]').hasText('Improved OSF Search');
        assert.dom('[data-test-help-body-1]').exists();
        assert.dom('[data-test-help-body-1]').hasText(`Enter any term in the search box 
            and filter by specific object types. More information is available on our help guides.`);
        assert.dom('[data-test-help-enumeration-1]').exists();
        assert.dom('[data-test-help-enumeration-1]').hasText('1 of 3');

        // verify second popover displays
        await click('[data-test-help-next-1]');
        assert.dom('[data-test-search-help-2]').exists();
        // verify second popover content
        assert.dom('[data-test-help-heading-2]').exists();
        assert.dom('[data-test-help-heading-2]').hasText('OSF Smart Facets');
        assert.dom('[data-test-help-body-2]').exists();
        assert.dom('[data-test-help-body-2]').hasText(`Narrow the source, discipline, and more. 
            For example, find content supported by a specific funder or view only datasets.`);
        assert.dom('[data-test-help-enumeration-2]').exists();
        assert.dom('[data-test-help-enumeration-2]').hasText('2 of 3');

        // verify third popover displays
        await click('[data-test-help-next-2]');
        assert.dom('[data-test-search-help-3]').exists();
        // verify third popover content
        assert.dom('[data-test-help-heading-3]').exists();
        assert.dom('[data-test-help-heading-3]').hasText('Add Metadata');
        assert.dom('[data-test-help-body-3]').exists();
        assert.dom('[data-test-help-body-3]').hasText(`Remember to add metadata and resources 
            to your own work on OSF to make it more discoverable!`);
        assert.dom('[data-test-help-enumeration-3]').exists();
        assert.dom('[data-test-help-enumeration-3]').hasText('3 of 3');

        // verify popover closes
        assert.dom('[data-test-help-done]').exists();
        assert.dom('[data-test-help-done]').hasText('Done');
        await click('[data-test-help-done]');
        assert.dom('[data-test-search-help-1]').isNotVisible();
    });

    test('help tutorial can be skipped', async assert => {
        await visit('/search');
        assert.equal(currentURL(), '/search');

        // verify help tutorial starts
        assert.dom('[data-test-start-help]').exists();
        await click('[data-test-start-help]');

        // verify skip button works
        assert.dom('[data-test-help-skip-1]').exists();
        await click('[data-test-help-skip-1]');
        assert.dom('[data-test-search-help-1]').isNotVisible();
    });
});

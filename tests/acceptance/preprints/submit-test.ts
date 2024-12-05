import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

interface PreprintIndexTestContext extends TestContext {
    provider: ModelInstance<PreprintProviderModel>;
}

module('Acceptance | preprints | submit', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: PreprintIndexTestContext) {
        server.loadFixtures('preprint-providers');
        server.create('user', 'loggedIn');
    });

    test('Select a provider workflow', async function(this: PreprintIndexTestContext, assert) {
        await visit('/preprints');
        assert.equal(currentRouteName(), 'preprints.index', 'Current route is preprints landing page');

        // Preprint provider select page
        await click('[data-test-add-a-preprint-osf-navbar]');
        const pageTitle = document.getElementsByTagName('title')[0].innerText;
        assert.equal(pageTitle, 'OSF Preprints | Select Providers', 'Provider select page title is correct');
        assert.dom('[data-test-create-preprints]').isDisabled('Create preprint button is disabled by default');
        assert.dom('[data-test-provider-id="osf"]').exists('OSF provider is displayed');
        assert.dom('[data-test-provider-id="osf"] [data-test-select-button]').exists('OSF provider has select button');
        assert.dom('[data-test-provider-id="osf"] [data-test-select-button]')
            .hasText('Select', 'Select button has text when provider is not selected');

        // Select OSF provider
        await click('[data-test-provider-id="osf"] [data-test-select-button]');
        assert.dom('[data-test-create-preprints]')
            .isEnabled('Create preprint button is enabled after selecting provider');
        assert.dom('[data-test-provider-id="osf"] [data-test-select-button]')
            .hasText('Deselect', 'Select button language changes after selecting provider');

        // Create preprint workflow
        await click('[data-test-create-preprints]');
        assert.equal(currentRouteName(), 'preprints.submit', 'Current route is preprints submit page');
    });

    test('Preprint submit page with assertions', async function(this: PreprintIndexTestContext, assert) {
        await visit('/preprints/osf/submit');
        assert.equal(currentRouteName(), 'preprints.submit', 'Current route is preprints submit page');

        // Check leftnav items
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"]')
            .exists('Title and Abstract step is displayed');
        assert.dom('[data-test-preprint-submission-step="File"]').exists('File step is displayed');
        assert.dom('[data-test-preprint-submission-step="Metadata"]').exists('Metadata step is displayed');
        assert.dom('[data-test-preprint-submission-step="Author Assertions"]')
            .exists('Author Assertions step is displayed');
        assert.dom('[data-test-preprint-submission-step="Supplements"]').exists('Supplements step is displayed');
        assert.dom('[data-test-preprint-submission-step="Review"]').exists('Review step is displayed');
    });

    test('Preprint submit page with no assertions', async function(this: PreprintIndexTestContext, assert) {
        const osfProvider = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProviderModel>;
        osfProvider.update({ assertionsEnabled: false });
        await visit('/preprints/osf/submit');
        assert.equal(currentRouteName(), 'preprints.submit', 'Current route is preprints submit page');

        // Check leftnav items
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"]')
            .exists('Title and Abstract step is displayed');
        assert.dom('[data-test-preprint-submission-step="File"]').exists('File step is displayed');
        assert.dom('[data-test-preprint-submission-step="Metadata"]').exists('Metadata step is displayed');
        assert.dom('[data-test-preprint-submission-step="Author Assertions"]')
            .doesNotExist('Author Assertions step is NOT displayed');
        assert.dom('[data-test-preprint-submission-step="Supplements"]').exists('Supplements step is displayed');
        assert.dom('[data-test-preprint-submission-step="Review"]').exists('Review step is displayed');
    });

    test('Preprint submit page: Title and abstract', async function(this: PreprintIndexTestContext, assert) {
        await visit('/preprints/osf/submit');
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"] [data-test-icon]')
            .hasClass('fa-dot-circle', 'Title and Abstract step has selected icon');
        assert.dom('[data-test-preprint-submission-step="File"] [data-test-icon]')
            .hasClass('fa-circle', 'File step has unselected icon');

        // Preprint submit page rightnav
        assert.dom('[data-test-next-button]').exists('Next button is displayed');
        assert.dom('[data-test-next-button]').hasText('Next', 'Next button has text');
        assert.dom('[data-test-next-button]').isDisabled('Next button is disabled upon creating new preprint');
        assert.dom('[data-test-submit-button]').doesNotExist('Submit button is not displayed on first step');
        assert.dom('[data-test-delete-button]').exists('Delete button is displayed');

        // Preprint submit page main content
        assert.dom('[data-test-title-label]').exists('Title label is displayed');
        assert.dom('[data-test-title-input]').exists('Title input is displayed');
        assert.dom('[data-test-abstract-label]').exists('Abstract label is displayed');
        assert.dom('[data-test-abstract-input]').exists('Abstract input is displayed');
    });
});

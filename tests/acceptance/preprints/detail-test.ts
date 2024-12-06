import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, skip, test } from 'qunit';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import PreprintModel from 'ember-osf-web/models/preprint';
import { PreprintProviderReviewsWorkFlow, ReviewsState } from 'ember-osf-web/models/provider';
import { Permission } from 'ember-osf-web/models/osf-model';

interface PreprintDetailTestContext extends TestContext {
    provider: ModelInstance<PreprintProviderModel>;
    preprint: ModelInstance<PreprintModel>;
}

module('Acceptance | preprints | detail', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: PreprintDetailTestContext) {
        server.loadFixtures('preprint-providers');
        const provider = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProviderModel>;
        provider.update({
            reviewsWorkflow: PreprintProviderReviewsWorkFlow.PRE_MODERATION,
            assertionsEnabled: true,
        });

        const preprint = server.create('preprint', {
            id: 'test',
            provider,
            currentUserPermissions: Object.values(Permission),
            title: 'Test Preprint',
            description: 'This is a test preprint',
        });
        this.provider = provider;
        this.preprint = preprint;
    });

    test('Accepted preprint detail page', async function(this: PreprintDetailTestContext, assert) {
        this.preprint.update({
            reviewsState: ReviewsState.ACCEPTED,
        });
        await visit('/preprints/osf/test');
        assert.equal(currentRouteName(), 'preprints.detail', 'Current route is preprint detail');

        // Check page title
        const pageTitle = document.getElementsByTagName('title')[0].innerText;
        assert.equal(pageTitle, 'OSF Preprints | Test Preprint', 'Page title is correct');

        // Check preprint title
        assert.dom('[data-test-preprint-title]').exists('Title is displayed');
        assert.dom('[data-test-preprint-title]').hasText('Test Preprint', 'Title is correct');

        // Check edit and new version buttons
        assert.dom('[data-test-edit-preprint-button]').exists('Edit button is displayed');
        assert.dom('[data-test-edit-preprint-button]').containsText('Edit', 'Edit button text is correct');
        assert.dom('[data-test-create-new-version-button]').exists('New version button is displayed');

        // Check preprint authors
        assert.dom('[data-test-contributor-name]').exists('Authors are displayed');

        // TODO: Check author assertions

        // Check preprint status banner
        assert.dom('[data-test-status]').exists('Status banner is displayed');
        assert.dom('[data-test-status]').containsText('accepted', 'Status is correct');
    });

    test('Pre-mod: Rejected preprint detail page', async function(this: PreprintDetailTestContext, assert) {
        this.provider.update({
            reviewsWorkflow: PreprintProviderReviewsWorkFlow.PRE_MODERATION,
        });
        this.preprint.update({
            reviewsState: ReviewsState.REJECTED,
        });
        await visit('/preprints/osf/test');
        assert.equal(currentRouteName(), 'preprints.detail', 'Current route is preprint detail');

        // Check page title. Should be same as accepted preprint
        const pageTitle = document.getElementsByTagName('title')[0].innerText;
        assert.equal(pageTitle, 'OSF Preprints | Test Preprint', 'Page title is correct');

        // Check preprint title. Should be same as accepted preprint
        assert.dom('[data-test-preprint-title]').exists('Title is displayed');
        assert.dom('[data-test-preprint-title]').hasText('Test Preprint', 'Title is correct');

        // Check edit and new version buttons
        assert.dom('[data-test-edit-preprint-button]').exists('Edit button is displayed');
        assert.dom('[data-test-edit-preprint-button]')
            .hasText('Edit and resubmit', 'Edit button text indicates resubmission');
        assert.dom('[data-test-create-new-version-button]').doesNotExist('New version button is not displayed');

        // Check preprint authors
        assert.dom('[data-test-contributor-name]').exists('Authors are displayed');

        // Check preprint status banner
        assert.dom('[data-test-status]').exists('Status banner is displayed');
        assert.dom('[data-test-status]').containsText('rejected', 'Status is correct');
    });


    skip('Withdrawn preprint detail page', async function(this: PreprintDetailTestContext, _) {
        // TODO: Implement test
    });
});

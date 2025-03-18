import { currentRouteName, settled } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import PreprintModel from 'ember-osf-web/models/preprint';
import { PreprintProviderReviewsWorkFlow, ReviewsState } from 'ember-osf-web/models/provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import { click } from 'ember-osf-web/tests/helpers';

interface PreprintDetailTestContext extends TestContext {
    provider: ModelInstance<PreprintProviderModel>;
    preprint: ModelInstance<PreprintModel>;
}

module('Acceptance | preprints | detail', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: PreprintDetailTestContext) {
        server.loadFixtures('preprint-providers');
        server.loadFixtures('citation-styles');
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
        assert.dom('[data-test-withdrawal-button]').exists('Withdraw button is displayed');

        // Check preprint authors
        assert.dom('[data-test-contributor-name]').exists('Authors are displayed');

        // TODO: Check author assertions

        // Check preprint status banner
        assert.dom('[data-test-status]').exists('Status banner is displayed');
        assert.dom('[data-test-status]').containsText('accepted', 'Status is correct');
        await percySnapshot(assert);
    });

    test('Accepted preprint, prior version detail page', async function(this: PreprintDetailTestContext, assert) {
        this.preprint.update({
            reviewsState: ReviewsState.ACCEPTED,
            isLatestVersion: false,
        });
        await visit('/preprints/osf/test');

        // Check edit and new version buttons
        assert.dom('[data-test-edit-preprint-button]').doesNotExist('Edit button is not displayed for prior versions');
        assert.dom('[data-test-create-new-version-button]')
            .doesNotExist('New version button is not displayed for prior versions');
        assert.dom('[data-test-withdrawal-button]').exists('Withdraw button is displayed for prior versions');

        // Check preprint status banner
        assert.dom('[data-test-status]').exists('Status banner is displayed');
        assert.dom('[data-test-status]').containsText('accepted', 'Status is correct');
        await percySnapshot(assert);
    });

    test('Pre-mod: Rejected preprint detail page', async function(this: PreprintDetailTestContext, assert) {
        this.provider.update({
            reviewsWorkflow: PreprintProviderReviewsWorkFlow.PRE_MODERATION,
        });
        this.preprint.update({
            reviewsState: ReviewsState.REJECTED,
            datePublished: null,
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
        assert.dom('[data-test-withdrawal-button]').doesNotExist('Withdraw button is not displayed');

        // Check preprint authors
        assert.dom('[data-test-contributor-name]').exists('Authors are displayed');

        // Check preprint status banner
        assert.dom('[data-test-status]').exists('Status banner is displayed');
        assert.dom('[data-test-status]').containsText('rejected', 'Status is correct');
        await percySnapshot(assert);
    });


    test('Withdrawn preprint, only version detail page', async function(this: PreprintDetailTestContext, assert) {
        this.preprint.update({
            dateWithdrawn: new Date(),
        });
        await visit('/preprints/osf/test');

        // Check page title
        const pageTitle = document.getElementsByTagName('title')[0].innerText;
        assert.equal(pageTitle, 'OSF Preprints | Withdrawn: Test Preprint', 'Page title is correct');

        // Check new version button and no edit button
        assert.dom('[data-test-edit-preprint-button]').doesNotExist('Edit button is not displayed');
        assert.dom('[data-test-create-new-version-button]')
            .exists('New version button is displayed for latest withdrawn preprint version');
        assert.dom('[data-test-withdrawal-button]').doesNotExist('Withdraw button is not displayed');
        assert.dom('[data-test-previous-versions-button]').exists('Previous versions button is displayed');
        await click('[data-test-previous-versions-button]');
        assert.dom('[data-test-no-other-versions]').exists({ count: 1 }, 'No other versions message is displayed');
        assert.dom('[data-test-version-link]').doesNotExist('No links to previous versions are displayed');
        await percySnapshot(assert);
    });

    test('Withdrawn preprint, prior version detail page', async function(this: PreprintDetailTestContext, assert) {
        this.preprint = server.create('preprint', {
            id: 'test',
            dateWithdrawn: new Date(),
            currentUserPermissions: Object.values(Permission),
            title: 'Test Preprint',
            reviewsState: ReviewsState.WITHDRAWN,
            description: 'This is a test preprint',
        }, 'withVersions');
        this.preprint.update({
            isLatestVersion: false,
            provider: this.provider,
        });

        await visit('/preprints/osf/test');

        // Check no new version button and no edit button
        assert.dom('[data-test-edit-preprint-button]').doesNotExist('Edit button is not displayed');
        assert.dom('[data-test-create-new-version-button]')
            .doesNotExist('New version button is not displayed for prior withdrawn preprint version');
        assert.dom('[data-test-withdrawal-button]').doesNotExist('Withdraw button is not displayed');
        assert.dom('[data-test-previous-versions-button]').exists('Previous versions button is displayed');
        await click('[data-test-previous-versions-button]');
        assert.dom('[data-test-version-link]').exists({ count: 3 }, 'Link to previous version is displayed');
        assert.dom('[data-test-no-other-versions]').doesNotExist('No other versions message is not displayed');
        await percySnapshot(assert);
    });

    test('Edit button visibility', async function(this: PreprintDetailTestContext, assert) {
        // Read only
        this.preprint.update({
            currentUserPermissions: [Permission.Read],
            reviewsState: ReviewsState.ACCEPTED,
        });

        const preprint: PreprintModel = this.owner.lookup('service:store').findRecord('preprint', 'test');
        await visit('/preprints/osf/test');
        assert.dom('[data-test-edit-preprint-button]').doesNotExist('Edit button is not displayed for read-only users');

        // Non-latest
        preprint.setProperties({
            currentUserPermissions: Object.values(Permission),
            reviewsState: ReviewsState.ACCEPTED,
            isLatestVersion: false,
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]')
            .doesNotExist('Edit button is not displayed for non-latest versions');

        // Not initial, pre-mod, rejected, not latest
        preprint.setProperties({
            reviewsState: ReviewsState.REJECTED,
            version: 4,
            isLatestVersion: false,
            currentUserPermissions: Object.values(Permission),
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]')
            .exists('Edit button is not displayed for non-initial pre-mod not latest rejected');

        // Not initial, pre-mod, rejected, latest
        preprint.setProperties({
            reviewsState: ReviewsState.REJECTED,
            version: 4,
            isLatestVersion: true,
            currentUserPermissions: Object.values(Permission),
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]')
            .exists('Edit button is not displayed for non-initial pre-mod latest rejected');

        // Initial, pre-mod, rejected
        preprint.setProperties({
            reviewsState: ReviewsState.REJECTED,
            version: 1,
            isLatestVersion: false,
            currentUserPermissions: Object.values(Permission),
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]').exists('Edit button is displayed for initial pre-mod rejected');
        assert.dom('[data-test-edit-preprint-button]')
            .containsText('Edit and resubmit', 'Edit and resubmit option for initial pre-mod rejected');

        // Pre-mod, pending
        preprint.setProperties({
            reviewsState: ReviewsState.PENDING,
            isLatestVersion: false,
            currentUserPermissions: Object.values(Permission),
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]').exists('Edit button is displayed for pre-mod pending');
        assert.dom('[data-test-edit-preprint-button]').containsText('Edit', 'Edit option for pre-mod pending');

        // Withdrawn
        preprint.setProperties({
            dateWithdrawn: new Date(),
            currentUserPermissions: Object.values(Permission),
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]').doesNotExist('Edit button is not displayed for withdrawn');

        // Latest
        preprint.setProperties({
            dateWithdrawn: null,
            isLatestVersion: true,
            currentUserPermissions: Object.values(Permission),
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]').exists('Edit button is displayed for latest version');
        assert.dom('[data-test-edit-preprint-button]').containsText('Edit', 'Edit option for latest version');

        // Inital state
        preprint.setProperties({
            reviewsState: ReviewsState.INITIAL,
            isLatestVersion: false,
            currentUserPermissions: Object.values(Permission),
        });
        await settled();
        assert.dom('[data-test-edit-preprint-button]').exists('Edit button is displayed for initial state');
        assert.dom('[data-test-edit-preprint-button]').containsText('Edit', 'Edit option for initial state');
    });
});

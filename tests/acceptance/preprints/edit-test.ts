import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ReviewsState } from 'ember-osf-web/models/provider';
import { Permission } from 'ember-osf-web/models/osf-model';

interface PreprintEditTestContext extends TestContext {
    provider: ModelInstance<PreprintProviderModel>;
    miragePreprint: ModelInstance<PreprintModel>;
}

module('Acceptance | preprints | edit', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: PreprintEditTestContext) {
        server.loadFixtures('preprint-providers');
        server.create('user', 'loggedIn');
        const provider = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProviderModel>;
        const miragePreprint = server.create('preprint', {
            id: 'test',
            provider,
            currentUserPermissions: Object.values(Permission),
        });

        this.provider = provider;
        this.miragePreprint = miragePreprint;
    });

    test('LeftNav for accepted preprint with author assertions', async function(this: PreprintEditTestContext, assert) {
        this.provider.update({ assertionsEnabled: true });
        this.miragePreprint.update({reviewsState: ReviewsState.ACCEPTED});
        await visit('/preprints/osf/edit/test');
        assert.equal(currentRouteName(), 'preprints.edit', 'Current route is preprint edit');

        const pageTitle = document.getElementsByTagName('title')[0].innerText;
        // TODO: Edit page title should have provider's preprintWord in title. Note the space after "Edit" in next line
        assert.equal(pageTitle, 'OSF Preprints | Edit ', 'Page title is correct');

        // Check leftnav for Title and Abstract, Metadata, Author Assertsions, Supplements and Review steps
        // Should have no File step
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"]').exists();
        assert.dom('[data-test-preprint-submission-step="Metadata"]').exists();
        assert.dom('[data-test-preprint-submission-step="Author Assertions"]').exists();
        assert.dom('[data-test-preprint-submission-step="Supplements"]').exists();
        assert.dom('[data-test-preprint-submission-step="Review"]').exists();
        assert.dom('[data-test-preprint-submission-step="File"]')
            .doesNotExist('File step should not be present when editing an accepted preprint');
    });

    test('LeftNav for rejected preprint with author assertions', async function(this: PreprintEditTestContext, assert) {
        this.provider.update({ assertionsEnabled: true });
        this.miragePreprint.update({reviewsState: ReviewsState.REJECTED});

        await visit('/preprints/osf/edit/test');
        // Check leftnav for Title and Abstract, FILE, Metadata, Author Assertsions, Supplements and Review steps
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"]').exists();
        assert.dom('[data-test-preprint-submission-step="File"]')
            .exists('File upload step present when editing a rejected preprint');
        assert.dom('[data-test-preprint-submission-step="Metadata"]').exists();
        assert.dom('[data-test-preprint-submission-step="Author Assertions"]').exists();
        assert.dom('[data-test-preprint-submission-step="Supplements"]').exists();
        assert.dom('[data-test-preprint-submission-step="Review"]').exists();
    });

    // Same as above, but with assertions disabled
    test('LeftNav for accepted preprint wihout assertions', async function(this: PreprintEditTestContext, assert) {
        this.provider.update({ assertionsEnabled: false });
        this.miragePreprint.update({reviewsState: ReviewsState.ACCEPTED});

        await visit('/preprints/osf/edit/test');
        // Check leftnav for Title and Abstract, Metadata, Supplements and Review steps
        // Should have no File step, and no Author Assertions step
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"]').exists();
        assert.dom('[data-test-preprint-submission-step="File"]')
            .doesNotExist('File step should not be present when editing an accepted preprint');
        assert.dom('[data-test-preprint-submission-step="Metadata"]').exists();
        assert.dom('[data-test-preprint-submission-step="Author Assertions"]')
            .doesNotExist('Author Assertions step should not be present when author assertions are disabled');
        assert.dom('[data-test-preprint-submission-step="Supplements"]').exists();
        assert.dom('[data-test-preprint-submission-step="Review"]').exists();
    });

    test('LeftNav for rejected preprint without assertions', async function(this: PreprintEditTestContext, assert) {
        this.provider.update({ assertionsEnabled: false });
        this.miragePreprint.update({reviewsState: ReviewsState.REJECTED});

        await visit('/preprints/osf/edit/test');
        // Check leftnav for Title and Abstract, FILE, Metadata, Supplements and Review steps
        // Should have no Author Assertions step
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"]').exists();
        assert.dom('[data-test-preprint-submission-step="File"]')
            .exists('File upload step present when editing a rejected preprint');
        assert.dom('[data-test-preprint-submission-step="Metadata"]').exists();
        assert.dom('[data-test-preprint-submission-step="Author Assertions"]')
            .doesNotExist('Author Assertions step should not be present when author assertions are disabled');
        assert.dom('[data-test-preprint-submission-step="Supplements"]').exists();
        assert.dom('[data-test-preprint-submission-step="Review"]').exists();
    });

    test('Edit workflow prepopulated with preprint info', async function(this: PreprintEditTestContext, assert) {
        this.provider.update({ assertionsEnabled: true });
        this.miragePreprint.update({
            reviewsState: ReviewsState.ACCEPTED,
            title: 'My preprint',
            description: 'This is a my preprint',
        });

        await visit('/preprints/osf/edit/test');
        // Check current step is Title and Abstract
        assert.dom('[data-test-preprint-submission-step="Title and Abstract"] [data-test-icon]')
            .hasClass('fa-dot-circle', 'Title and Abstract icon shows as active');

        // check that the title and abstract are prepopulated
        assert.dom('[data-test-title-input] input').hasValue('My preprint', 'Title input is prepopulated');
        assert.dom('[data-test-abstract-input] textarea')
            .hasValue('This is a my preprint', 'Abstract input is prepopulated');

        // check rightnav validation status
        assert.dom('[data-test-next-button]').exists('Next button present on Title and Abstract step');
        assert.dom('[data-test-next-button]').isEnabled('Next button enabled on Title and Abstract step');
        assert.dom('[data-test-submit-button]').doesNotExist('Submit button not present on Title and Abstract step');
    });
});

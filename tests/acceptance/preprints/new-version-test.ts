import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ReviewsState } from 'ember-osf-web/models/provider';
import { Permission } from 'ember-osf-web/models/osf-model';

interface PreprintNewVersionTestContext extends TestContext {
    provider: ModelInstance<PreprintProviderModel>;
    miragePreprint: ModelInstance<PreprintModel>;
}

module('Acceptance | preprints | new version', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: PreprintNewVersionTestContext) {
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

    test('LeftNav for new preprint version', async function(this: PreprintNewVersionTestContext, assert) {
        this.miragePreprint.update({reviewsState: ReviewsState.ACCEPTED});
        await visit('/preprints/osf/new-version/test');
        assert.equal(currentRouteName(), 'preprints.new-version', 'Current route is preprint new-version');

        const pageTitle = document.getElementsByTagName('title')[0].innerText;
        assert.equal(pageTitle, 'OSF Preprints | New Version', 'Page title is correct');

        assert.dom('[data-test-preprint-submission-step="File"]').exists('File step present');
        assert.dom('[data-test-preprint-submission-step="Metadata"]').doesNotExist('Metadata step not present');
        assert.dom('[data-test-preprint-submission-step="Author Assertions"]')
            .doesNotExist('Author Assertions step not present');
        assert.dom('[data-test-preprint-submission-step="Review"]').exists('Review step present');
        await percySnapshot(assert);
    });
});

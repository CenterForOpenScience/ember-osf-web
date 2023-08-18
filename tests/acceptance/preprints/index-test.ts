import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

interface PreprintIndexTestContext extends TestContext {
    provider: ModelInstance<PreprintProviderModel>;
}

module('Acceptance | preprints | index', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: PreprintIndexTestContext) {
        server.loadFixtures('preprint-providers');
        const provider = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProviderModel>;
        const brand = server.create('brand');
        provider.update({
            brand,
            description: 'This is the description for OSF',
        });
        this.provider = provider;
    });

    test('OSF - Provider', async function(this: PreprintIndexTestContext, assert) {
        await visit('/preprints');
        assert.equal(currentRouteName(), 'preprints.index', 'Current route is preprints');

        const pageTitle = document.getElementsByTagName('title')[0].innerText;
        assert.equal(pageTitle, 'OSF Preprints', 'Page title is correct');
        assert.dom('[data-test-provider-description]').exists('This is the description for OSF');
    });
});

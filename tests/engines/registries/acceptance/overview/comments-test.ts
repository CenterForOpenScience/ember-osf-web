import { currentRouteName } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Registries | Acceptance | overview.comments', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        server.create('root', { currentUser: null });
    });

    test('it renders', async function(this: TestContext, assert: Assert) {
        const registration = server.create('registration');

        await visit(`/${registration.id}/comments`);

        assert.equal(currentURL(), `/${registration.id}/comments`, 'At the guid URL');
        assert.equal(currentRouteName(), 'registries.overview.comments', 'At the expected route');
    });
});

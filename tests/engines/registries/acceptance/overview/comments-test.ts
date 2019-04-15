import { currentRouteName } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { currentURL, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.comments', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('it renders', async assert => {
        const registration = server.create(
            'registration',
            { currentUserPermissions: [Permission.Admin] },
            'withComments',
        );

        await visit(`/${registration.id}/comments`);
        await percySnapshot(assert);

        assert.equal(currentURL(), `/${registration.id}/comments`, 'At the guid URL');
        assert.equal(currentRouteName(), 'registries.overview.comments', 'At the expected route');
    });
});

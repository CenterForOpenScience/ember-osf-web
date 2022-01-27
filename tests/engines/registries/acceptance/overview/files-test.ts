import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { currentURL, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.files', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('it renders', async assert => {
        const registration = server.create(
            'registration',
            { currentUserPermissions: [Permission.Admin] },
            'withFiles',
        );

        await visit(`/${registration.id}/files`);
        await percySnapshot(assert);

        assert.equal(currentURL(), `/${registration.id}/files`, 'At registration files list URL');
        assert.equal(currentRouteName(), 'registries.overview.files', 'At the expected route');
    });
});

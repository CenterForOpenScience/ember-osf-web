import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';

import { createRegistrationMetadata } from 'ember-osf-web/mirage/factories/utils';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.view-only-link', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
    });

    test('anonymized registered_meta should not break everything', async assert => {
        server.create('root', 'withAnonymizedVOL');
        const viewOnlyToken = 'thisisatoken';

        const registrationSchema = server.schema.registrationSchemas.find('prereg_challenge');
        const mirageReg = server.create('registration', {
            registrationSchema,
            registeredMeta: createRegistrationMetadata(registrationSchema, true, true),
            pendingRegistrationApproval: true,
            public: false,
        });

        await visit(`/${mirageReg.id}?view_only=${viewOnlyToken}`);

        assert.dom('[data-test-page-heading]').exists({ count: 7 });

        const assertAuthors = assert.dom('[data-test-read-only-contributors-list]');
        assertAuthors.exists({ count: 1 });
        assertAuthors.hasText('', 'Authors question empty');
    });
});

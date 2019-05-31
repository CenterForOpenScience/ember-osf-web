import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { module, test } from 'qunit';

import { createRegistrationMetadata } from 'ember-osf-web/mirage/factories/utils';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.view-only-link', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
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

        assert.dom('[data-test-form-section]').exists({ count: 7 });
        const assertTitle = assert.dom('#study-information\\.title p');
        assertTitle.exists({ count: 1 });
        assertTitle.hasAnyText();

        const assertAuthors = assert.dom('#study-information\\.authors p');
        assertAuthors.exists({ count: 1 });
        assertAuthors.hasText('', 'Authors question empty');
    });
});

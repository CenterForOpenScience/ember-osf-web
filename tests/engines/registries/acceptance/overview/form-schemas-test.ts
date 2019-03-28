import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview form schemas', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('All registration schemas render', async assert => {
        server.loadFixtures('registration-schemas');

        for (const registrationSchema of server.schema.registrationSchemas.all().models) {
            const registration = server.create('registration', { registrationSchema });
            await visit(`/${registration.id}`);

            const msg = `Registration form renders for schema ${registrationSchema.id}`;

            await percySnapshot(msg);
            assert.dom('[data-test-form-section]').exists({
                count: registrationSchema.schemaNoConflict!.pages.length,
            }, msg);
        }
    });
});

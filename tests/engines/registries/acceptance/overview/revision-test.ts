import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

interface ModeratorModeTestContext extends TestContext {
    provider: ModelInstance<RegistrationProviderModel>;
}

module('Registries | Acceptance | overview.revision', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);
    setupIntl(hooks);

    test('viewing a specific revision', async function(this: ModeratorModeTestContext, assert) {
        const user = server.create('user', { fullName: 'Foo Bar' });
        const registration = server.create('registration', {
            id: 'kovacs',
        });
        const revision = server.create('revision', {
            id: 'colman',
            initiatedBy: user,
            dateModified: new Date(),
            revisionJustification: 'This registration went into a phone booth',
            revisionResponses: { q1: 'Super Man' },
            registration,
        });
        await visit(`/${registration.id}?revisionId=${revision.id}`);
        assert.dom('[data-test-version-metadata-title]')
            .exists('version metadata is shown when viewing a specific revision');
        await percySnapshot(assert);
    });
});

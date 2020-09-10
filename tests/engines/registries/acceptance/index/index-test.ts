import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'ember-get-config';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';
import registriesConfig from 'registries/config/environment';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | registries index (landing page)', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('recent registrations list', async assert => {
        const recentRegs = server.createList('registration', 5, 'withContributors');
        registriesConfig.indexPageRegistrationsQuery = recentRegs.mapBy('id').join(',');
        server.createList('registration', 2, 'withContributors');

        await visit('/registries');
        await percySnapshot(assert);

        for (const reg of recentRegs) {
            assert.dom(`[data-test-recent-registration-id=${reg.id}]`)
                .hasProperty('href', `${config.OSF.url}${reg.id}`);
            assert.dom(`[data-test-recent-registration-id=${reg.id}]`)
                .hasText(reg.title);
        }

        assert.dom('[data-test-recent-registration-id]').exists({ count: recentRegs.length },
            'non-recent registrations don\'t show');

        delete registriesConfig.indexPageRegistrationsQuery;
    });
});

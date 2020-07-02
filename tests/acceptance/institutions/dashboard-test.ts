import { currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | institutions | dashboard';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('institutions dashboard', async assert => {
        server.create('institution', {
            id: 'has-users',
        }, 'withMetrics');
        await visit('/institutions/has-users/dashboard');
        assert.equal(
            currentURL(),
            '/institutions/has-users/dashboard',
            "Still at '/institutions/has-users/dashboard'.",
        );
        await percySnapshot(`${moduleName} - default`);
        await click('[data-test-next-page-button]');
        await percySnapshot(`${moduleName} - next page`);
    });
});

import { currentURL, settled, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
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
        await settled();
        assert.equal(
            currentURL(),
            '/institutions/has-users/dashboard',
            "Still at '/institutions/has-users/dashboard'.",
        );
        await percySnapshot(`${moduleName} - default`);
        await settled();
        await settled(); // the paginator apparently only renders after two settles
        assert.dom('[data-test-next-page-button]').exists({ count: 1 }, 'next page button exists!?');
        await click('[data-test-next-page-button]');
        await settled();
        await settled();
        await percySnapshot(`${moduleName} - next page`);
    });
});

import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | meetings | detail';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('meetings detail', async assert => {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            submissions: server.createList('meeting-submission', 15),
        });
        await visit('/meetings/testmeeting');
        assert.equal(currentURL(), '/meetings/testmeeting', "Still at '/meetings/testmeeting'.");
        await percySnapshot(`${moduleName} - default`);
        await click('[data-test-meeting-toggle-panel-button]');
        await click('[data-test-next-page-button]');
        await percySnapshot(`${moduleName} - panel open & next page`);
    });
});

import { click, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | guid file', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('misc screenshots for Percy', async () => {
        const currentUser = server.create('user', 'loggedIn');
        const file = server.create('file', { user: currentUser });
        await visit(`--file/${file.id}`);
        await percySnapshot('Acceptance | Guid file');
        await click('[data-test-share-button]');
        await percySnapshot('Acceptance | Guid file | share button | share tab');
        await click('[data-test-embed-tab]');
        await percySnapshot('Acceptance | Guid file | share button | embed tab');
        await click('[data-test-share-button]');
        await click('[data-test-revisions-tab]');
        await percySnapshot('Acceptance | Guid file | revisions tab');
        await click('[data-test-delete-button]');
        await percySnapshot('Acceptance | Guid file | delete button');
    });
});

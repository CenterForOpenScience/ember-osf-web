import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
// import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';

module('Acceptance | guid-node/files', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('leftnav for read user', async function(assert) {
        const node = server.create('node', 'withFiles');
        await visit(`/${node.id}/files`);

        assert.equal(currentRouteName(), 'guid-node.files.provider', 'Current route is files');
        assert.dom('[data-test-overview-link]').exists('Overview link exists');
        assert.dom('[data-test-files-link]').exists('Files link exists');
        // check active tab + file providers
        assert.dom('[data-test-analytics-link]').exists('Analytics link exists');
        assert.dom('[data-test-registrations-link]').exists('Registrations link exists');
        assert.dom('[data-test-contributors-link]').exists('Contributors link exists');
        assert.dom('[data-test-settings-link]').exists('Settings link exists');
    });

    // test no files
    // test selecting files + file actions
    // test switching providers
    // test links for different user permissions and VOL status and wiki enabled
});

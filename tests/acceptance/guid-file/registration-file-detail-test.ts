import {
    currentURL,
    visit,
} from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | guid file | registration files', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('works', async assert => {
        const registration = server.create('registration');
        const fileOne = server.create('file', { target: registration, name: 'Test File' });
        await visit(`/--file/${fileOne.id}`);
        assert.equal(currentURL(), `/--file/${fileOne.guid}`);
        assert.dom('[data-test-filename]')
            .hasText('Test File', 'The correct filename is on the page');
        assert.dom('[data-test-file-renderer] iframe').exists('File renderer is rendering');
        assert.dom('[data-test-project-link]')
            .hasText(registration.title, 'Link to registration has the title of the registration' );
        await percySnapshot(assert);
    });
});

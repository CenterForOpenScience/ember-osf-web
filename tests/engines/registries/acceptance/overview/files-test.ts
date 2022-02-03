import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { currentURL, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.files', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('Files list view', async assert => {
        const registration = server.create(
            'registration',
            { currentUserPermissions: [Permission.Admin] },
            'withFiles',
        );

        await visit(`/${registration.id}/files`);
        await percySnapshot(assert);
        const rootFolder = registration.files.models[0].rootFolder;
        assert.equal(currentURL(), `/${registration.id}/files`, 'At registration files list URL');
        assert.equal(currentRouteName(), 'registries.overview.files', 'At the expected route');

        assert.dom('[data-test-file-search]').exists('File search input exists');
        assert.dom('[data-test-file-sort-trigger]').exists('File sort trigger exists');
        assert.dom('[data-test-file-help]').exists('File help button exists');

        assert.dom('[data-test-download-all]').hasAttribute(
            'href',
            `http://localhost:8000/wb/files/${rootFolder.id}/upload/?zip=`,
            'Download all from here button has the right download link',
        );

        // assert.dom('[data-test-file-list-item]').exists({ count: files.length }, 'Files displayed');
        // assert.dom('[data-test-file-list-link]').containsText('Name', 'File name displayed');
        // assert.dom('[data-test-file-list-date]').containsText('Date', 'File date displayed');
        // assert.dom('[data-test-file-download-share-trigger]').exists('File download/share trigger exists');
    });
});

import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';
import { t } from 'ember-intl/test-support';

import { Permission } from 'ember-osf-web/models/osf-model';
import { click, currentURL, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.files', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('Redirects to page not found', async assert => {
        const registration = server.create(
            'registration',
            { currentUserPermissions: [Permission.Admin] },
            'withFiles',
        );

        await visit(`/${registration.id}/files/osfstowage`);
        assert.equal(currentRouteName(), 'registries.overview.files.provider', 'At file provider route');
        assert.dom('[data-test-file-provider-invalid-provider]')
            .containsText(t('osf-components.file-browser.storage_providers.invalidProviderDetails'));
        assert.dom('[data-test-file-provider-invalid-provider-link]').exists('Links to proper provider');
        assert.dom('[data-test-file-list-item]').doesNotExist('No file items');
    });

    test('Files list view', async assert => {
        const registration = server.create(
            'registration',
            { currentUserPermissions: [Permission.Admin] },
            'withFiles',
        );

        await visit(`/${registration.id}/files`);
        await percySnapshot(assert);
        assert.equal(currentURL(), `/${registration.id}/files`, 'At registration files list URL');
        assert.equal(currentRouteName(), 'registries.overview.files.provider', 'At the expected route');

        assert.dom('[data-test-file-search]').exists('File search input exists');
        assert.dom('[data-test-file-sort-trigger]').exists('File sort trigger exists');
        assert.dom('[data-test-file-help]').exists('File help button exists');
        assert.dom('[data-test-add-new-trigger]').doesNotExist('Add new button not shown');

        assert.dom('[data-test-file-providers-list]').containsText(
            t('osf-components.file-browser.storage_providers.osfstorage'),'File providers list contains OSF Storage',
        );

        assert.dom('[data-test-download-all]').hasAttribute(
            'href',
            `http://localhost:8000/v2/registrations/${registration.id}/files/osfstorage/upload?zip=`,
            'Download all from here button has the right download link',
        );

        assert.dom('[data-test-file-list-item]').exists('Files displayed');
        assert.dom('[data-test-file-name]').exists('File name displayed');
        assert.dom('[data-test-file-list-date]').exists('File date displayed');
        assert.dom('[data-test-file-download-share-trigger]').exists('File download/share trigger exists');
        await click('[data-test-file-download-share-trigger]');
        assert.dom('[data-test-download-button]').exists('Download button exists');
        assert.dom('[data-test-embed-button]').exists('Embed button exists');
        assert.dom('[data-test-social-sharing-button]').exists('Share button exists');
        assert.dom('[data-test-delete-button]').doesNotExist('Delete button not shown');
        assert.dom('[data-test-rename-link]').doesNotExist('Rename button not shown');
        assert.dom('[data-test-move-button]').doesNotExist('Move button not shown');
        assert.dom('[data-test-copy-button]').doesNotExist('Copy button not shown');

    });

    test('No files', async assert => {
        const registration = server.create('registration');

        await visit(`/${registration.id}/files`);
        await percySnapshot(assert);
        assert.equal(currentURL(), `/${registration.id}/files`, 'At registration files list URL');

        assert.dom('[data-test-file-list-item]').doesNotExist('No files displayed');
        assert.dom('[data-test-empty-folder]')
            .containsText(t('osf-components.file-browser.empty_folder'), 'Empty folder');
    });
});

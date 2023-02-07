import {
    currentURL,
    visit,
} from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import FileModel from 'ember-osf-web/models/file';
import RegistrationModel from 'ember-osf-web/models/registration';

interface ThisTestContext extends TestContext {
    registration: ModelInstance<RegistrationModel>;
    file: ModelInstance<FileModel>;
}

module('Acceptance | guid file | registration files', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.registration = server.create('registration');
        this.file = server.create('file', { target: this.registration, name: 'Test File' });
    });

    test('Desktop view', async function(this: ThisTestContext, assert) {
        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);
        assert.dom('[data-test-filename]')
            .hasText('Test File', 'The correct filename is on the page');
        assert.dom('[data-test-file-renderer] iframe').exists('File renderer is rendering');
        assert.dom('[data-test-project-link]')
            .hasText(this.registration.title, 'Link to registration has the title of the registration' );
        assert.dom('[data-test-file-download-share-trigger]').exists('File download/share trigger exists');
        assert.dom('[data-test-file-renderer-button]').doesNotExist('File renderer button does not exist for desktop');
        assert.dom('[data-test-versions-button]').exists('Versions button exists');
        assert.dom('[data-test-tags-button]').exists('Tags button exists');
        await percySnapshot(assert);
    });

    test('mobile view', async function(this: ThisTestContext, assert) {
        setBreakpoint('mobile');
        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);
        assert.dom('[data-test-filename]')
            .hasText('Test File', 'The correct filename is on the page');
        assert.dom('[data-test-file-renderer]').exists('File renderer is shown by default');
        assert.dom('[data-test-project-link]')
            .hasText(this.registration.title, 'Link to registration has the title of the registration' );
        assert.dom('[data-test-file-download-share-trigger]').exists('File download/share trigger exists');
        assert.dom('[data-test-file-renderer-button]').exists('File renderer button exists for mobile');
        assert.dom('[data-test-versions-button]').exists('Versions button exists');
        assert.dom('[data-test-tags-button]').exists('Tags button exists');
        await percySnapshot('Acceptance | guid file | registration files | mobile view | file renderer');

        await click('[data-test-versions-button]');
        assert.dom('[data-test-revisions-tab]').exists('Revisions shown');
        assert.dom('[data-test-file-renderer]').doesNotExist('File renderer is hidden');
        await percySnapshot('Acceptance | guid file | registration files | mobile view | revisions');

        // click tags and verify appropriate panels shown

        await click('[data-test-file-renderer-button]');
        assert.dom('[data-test-file-renderer]').exists('File renderer is shown again');
        assert.dom('[data-test-revisions-tab]').doesNotExist('Revisions now hidden');
    });

    test('view revisions', async function(this: ThisTestContext, assert) {
        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);

        assert.dom('[data-test-filename]')
            .doesNotContainText(t('general.version'), 'Viewed version is not specified on page load');
        assert.dom('[data-test-revisions-tab]').doesNotExist('Revisions tab closed on page load');
        assert.dom('[data-test-versions-button]')
            .hasAria('label', t('file-detail.view-revisions'), 'Versions button has correct label when closed');

        await click('[data-test-versions-button]');
        assert.dom('[data-test-revisions-tab]').exists('Revisions tab opened');
        assert.dom('[data-test-versions-button]')
            .hasAria('label', t('file-detail.close-revisions'), 'Versions button has correct label when open');
        assert.dom('[data-test-file-version-item]').exists({ count: 2 }, 'Two file versions are shown');
        await click('[data-test-file-version-toggle-button]');
        assert.dom('[data-test-file-version-section]').exists({ count: 3 }, 'File version info is shown');
        await click('[data-test-file-version-date]');
        assert.dom('[data-test-filename]')
            .containsText(t('general.version'), 'Viewed version specified after selecting version');
        await percySnapshot(assert);

        await click('[data-test-versions-button]');
        assert.dom('[data-test-revisions-tab]').doesNotExist('Revisions tab closes when clicking button again');
        assert.dom('[data-test-versions-button]')
            .hasAria('label', t('file-detail.view-revisions'), 'Versions button has correct label when closed');
    });

    // test for tags

    // test for switching views
});

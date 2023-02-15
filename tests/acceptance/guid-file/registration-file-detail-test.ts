import {
    currentURL,
    visit,
} from '@ember/test-helpers';

import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { selectChoose } from 'ember-power-select/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';

import { module, skip, test } from 'qunit';

import FileModel from 'ember-osf-web/models/file';
import { Permission } from 'ember-osf-web/models/osf-model';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import RegistrationModel from 'ember-osf-web/models/registration';
import User from 'ember-osf-web/models/user';

interface ThisTestContext extends TestContext {
    registration: ModelInstance<RegistrationModel>;
    file: ModelInstance<FileModel>;
    currentUser: ModelInstance<User>;
}

module('Acceptance | guid file | registration files', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.registration = server.create('registration', {
            currentUserPermissions: [Permission.Write],
            isAnonymous: false,
        }, 'withContributors', 'withAffiliatedInstitutions', 'withFiles', 'isPublic');

        this.file = server.create('file', {
            target: this.registration,
            name: 'Test File',
        });
    });

    skip('Desktop view', async function(this: ThisTestContext, assert) {
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

    test('Mobile view', async function(this: ThisTestContext, assert) {
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

        assert.dom('[data-test-file-renderer]').exists();
        assert.dom('[data-test-metadata-tab]').doesNotExist();
        assert.dom('[data-test-revisions-tab]').doesNotExist();
        assert.dom('[data-test-tags-tab]').doesNotExist();

        // click versions and verify appropriate panels shown
        await click('[data-test-versions-button]');
        assert.dom('[data-test-revisions-tab]').exists('Revisions shown');
        assert.dom('[data-test-file-renderer]').doesNotExist('File renderer is hidden');
        await percySnapshot('Acceptance | guid file | registration files | mobile view | revisions');

        await click('[data-test-file-renderer-button]');
        assert.dom('[data-test-file-renderer]').exists('File renderer is shown again');
        assert.dom('[data-test-revisions-tab]').doesNotExist('Revisions now hidden');

        await click('[data-test-metadata-button]');
        assert.dom('[data-test-metadata-tab]').exists('Metadata tab now visible');
        assert.dom('[data-test-revisions-tab]').doesNotExist('Revisions now hidden');
        assert.dom('[data-test-file-renderer]').doesNotExist('File renderer now hidden');
        assert.dom('[data-test-tags-tab]').doesNotExist('Tags now hidden');
    });

    test('View revisions', async function(this: ThisTestContext, assert) {
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

    test('View metadata', async function(this: ThisTestContext, assert) {
        const node = server.create('node', {
            id: 'mtadt',
        }, 'currentUserAdmin', 'withContributors', 'withAffiliatedInstitutions', 'withFiles');

        const file = server.create('file', { target: node });
        const metadataRecord = await this.owner.lookup('service:store')
            .findRecord('custom-item-metadata-record', node.id);

        await visit(`/--file/${file.id}`);
        assert.equal(currentURL(), `/--file/${file.guid}`);

        // Default desktop tab
        assert.dom('[data-test-metadata-tab]').exists();
        assert.dom('[data-test-revisions-tab]').doesNotExist();
        assert.dom('[data-test-tags-tab]').doesNotExist();

        // Favicon
        assert.dom('[data-test-metadata-button]').hasAria('label', 'Close metadata',
            'Close metadata aria should be present when metadata tab is open.');
        assert.dom('[data-test-metadata-button] > svg').hasClass('fa-info-circle',
            'SVG info-circle is correct.');

        // File metadata
        assert.dom('[data-test-metadata-header]').hasText('File Metadata',
            'File metadata header is properly set.');
        // Title
        assert.dom('[data-test-file-title-label]').hasText('Title',
            'File metadata title label is properly set.');
        assert.dom('[data-test-file-title]').exists();
        // Description
        assert.dom('[data-test-file-description-label]').hasText('Description',
            'File metadata description label is properly set.');
        assert.dom('[data-test-file-description]').exists();
        // Resource type
        assert.dom('[data-test-file-resource-type-label]').hasText('Resource type',
            'File metadata resource type label is properly set.');
        assert.dom('[data-test-file-resource-type]').exists();
        // Resource language
        assert.dom('[data-test-file-language-label]').hasText('Resource language',
            'File metadata resource language label is properly set.');
        assert.dom('[data-test-file-language]').exists();
        // Contributors
        assert.dom('[data-test-target-contributors-label]').hasText('Contributors',
            'File metadata contributor label is properly set.');
        assert.dom('[data-test-target-contributors]').exists();
        // Affiliated institutions
        assert.dom('[data-test-target-institutions-label]').hasText('Affiliated institutions',
            'File metadata affiliated institutions label is properly set.');
        assert.dom('[data-test-target-institutions]').exists();
        // Funder metadata
        assert.dom('[data-test-target-funder-div]').exists();
        for (const funder of metadataRecord.funders) {
            // Funder name
            assert.dom('[data-test-target-funder-name-label]').hasText('Funder',
                'Funder name label is properly set.');
            assert.dom(`[data-test-target-funder-name="${funder.funder_name}"]`)
                .containsText(funder.funder_name, `Funder name is unchanged for ${funder.funder_name}.`);
            // Award title
            assert.dom('[data-test-target-funder-award-title-label]').hasText('Award title',
                'Funder award title label is properly set.');
            assert.dom(`[data-test-target-funder-award-title="${funder.funder_name}"]`)
                .containsText(funder.award_title, `Funder award title is unchanged for ${funder.funder_name}.`);
            // Award URI
            assert.dom('[data-test-target-funder-award-uri-label]').hasText('Award URI',
                'Funder award URI label is properly set.');
            assert.dom(`[data-test-target-funder-award-uri="${funder.funder_name}"]`)
                .containsText(funder.award_uri, `Funder award URI is unchanged for ${funder.funder_name}.`);
            // Award number
            assert.dom('[data-test-target-funder-award-number-label]').hasText('Award number',
                'Funder award number label is properly set.');
            assert.dom(`[data-test-target-funder-award-number="${funder.funder_name}"]`)
                .hasText(funder.award_number, `Funder award number is unchanged for ${funder.funder_name}`);
        }
        // Target title
        assert.dom('[data-test-target-title-label]').hasText('Title',
            'File metadata target title text is properly set.');
        assert.dom('[data-test-target-title]').exists();
        // Target description
        assert.dom('[data-test-target-description-label]').hasText('Description',
            'File metadata target description text is properly set.');
        assert.dom('[data-test-target-description]').exists();
    });

    // Node type
    test('Node type', async function(this: ThisTestContext, assert) {
        const project = server.create('node', 'currentUserAdmin', 'withAffiliatedInstitutions');
        const registration = server.schema.registrationSchemas.find('open_ended_registration');
        const component = server.create('node', {id: 'cmpnt', parent: project}, 'withFiles', 'withStorage');

        // Registration metadata
        await visit(`/--file/${registration.id}`);
        assert.equal(currentURL(), `/--file/${registration.id}`);
        assert.dom('[data-test-metadata-node]').hasText('Registration Metadata',
            'Node noun for registration properly set.');

        // Project metadata
        await visit(`/--file/${project.id}`);
        assert.equal(currentURL(), `/${project.id}/metadata`);
        assert.dom('[data-test-metadata-node]').hasText('Project Metadata',
            'Node noun for project properly set.');

        // Component metadata
        await visit(`/--file/${component.id}`);
        assert.equal(currentURL(), `/${component.id}/metadata`);
        assert.dom('[data-test-metadata-node]').hasText('Component Metadata',
            'Node noun for component properly set.');
    });

    // Save and cancel buttons with write permissions
    test('Save and cancel', async function(this: ThisTestContext, assert) {
        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);

        // Verify download
        assert.dom('[data-test-download-button]').exists();

        // Verify edit form
        await click('[data-test-edit-metadata-button]');
        assert.dom('[data-test-title-field]').exists();
        assert.dom('[data-test-description-field]').exists();
        assert.dom('[data-test-select-resource-type]').exists();
        assert.dom('[data-test-select-resource-language]').exists();
        assert.dom('[data-test-cancel-editing-metadata-button]').exists();
        assert.dom('[data-test-save-metadata-button]').exists();
        await click('[data-test-cancel-editing-metadata-button]');
        assert.dom('[data-test-edit-metadata-form]').doesNotExist();

        // Screenshot before changes
        await percySnapshot(assert);
        await click('[data-test-edit-metadata-button]');
        // Update title
        const editTitleTextArea = document.querySelectorAll('textarea')[0];
        editTitleTextArea.textContent = 'A test title.';
        assert.dom('[data-test-title-field]')
            .containsText('A test title.', 'Metadata title field updates.');
        // Update description
        const editDescriptionTextArea = document.querySelectorAll('textarea')[1];
        editDescriptionTextArea.textContent = 'A test description.';
        assert.dom('[data-test-description-field]')
            .containsText('A test description.', 'Metadata description field updates.');
        // Update resource type
        await selectChoose('[data-test-select-resource-type]', 'InteractiveResource');
        // Update resource language
        await selectChoose('[data-test-select-resource-language]', 'English');
        // Screenshot after changes
        await percySnapshot(assert);
        // Save changes
        await click('[data-test-save-metadata-button]');
        // Verify form closes
        assert.dom('[data-test-edit-metadata-form]').doesNotExist();
        assert.dom('[data-test-metadata-tab]').exists();
    });

    // Verify A11y testing
    test('A11y testing', async function(this: ThisTestContext, assert) {
        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);
        await a11yAudit();

        // verify metadata
        await click('[data-test-metadata-button]');
        await a11yAudit();

        // verify versions
        await click('[data-test-versions-button]');
        await a11yAudit();

        // verify tags
        await click('[data-test-tags-button]');
        await a11yAudit();

        assert.ok('No A11y issues');
    });
});

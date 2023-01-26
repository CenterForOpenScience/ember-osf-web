import {
    currentURL,
    visit,
} from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';

import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
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

        assert.dom('[data-test-file-renderer]').exists();
        assert.dom('[data-test-metadata-tab]').doesNotExist();
        assert.dom('[data-test-revisions-tab]').doesNotExist();
        assert.dom('[data-test-tags-tab]').doesNotExist();

        // click tags and verify appropriate panels shown
        await click('[data-test-versions-button]');
        assert.dom('[data-test-revisions-tab]').exists('Revisions shown');
        assert.dom('[data-test-file-renderer]').isNotVisible('File renderer is hidden');
        await percySnapshot('Acceptance | guid file | registration files | mobile view | revisions');

        await click('[data-test-file-renderer-button]');
        assert.dom('[data-test-file-renderer]').exists('File renderer is shown again');
        assert.dom('[data-test-revisions-tab]').isNotVisible('Revisions now hidden');

        await click('[data-test-metadata-button]');
        assert.dom('[data-test-metadata-tab]').exists('Metadata tab now visible');
        assert.dom('[data-test-revisions-tab]').isNotVisible('Revisions now hidden');
        assert.dom('[data-test-file-renderer]').isNotVisible('File renderer now hidden');
        assert.dom('[data-test-tags-tab]').isNotVisible('Tags now hidden');
    });

    test('view revisions', async function(this: ThisTestContext, assert) {
        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);

        assert.dom('[data-test-filename]')
            .doesNotContainText(t('general.version'), 'Viewed version is not specified on page load');
        assert.dom('[data-test-revisions-tab]').doesNotExist('Revisions tab closed on page load');
        assert.dom('[data-test-versions-button]')
            .hasAria('label', t('file_detail.view_revisions'), 'Versions button has correct label when closed');

        await click('[data-test-versions-button]');
        assert.dom('[data-test-revisions-tab]').exists('Revisions tab opened');
        assert.dom('[data-test-versions-button]')
            .hasAria('label', t('file_detail.close_revisions'), 'Versions button has correct label when open');
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
            .hasAria('label', t('file_detail.view_revisions'), 'Versions button has correct label when closed');
    });

    // Test file metadata
    test('view metadata', async function(this: ThisTestContext, assert) {
        const nodeNoun = ['Registration','Project','Component'];
        const metadataRecord = await this.owner.lookup('service:store')
            .findRecord('custom-item-metadata-record', this.registration.id);

        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);

        // Verify correct tab on dekstop
        assert.dom('[data-test-metadata-tab]').exists();
        assert.dom('[data-test-revisions-tab]').doesNotExist();
        assert.dom('[data-test-tags-tab]').doesNotExist();

        // Verify favicon
        assert.dom('[data-test-metadata-button]').hasAria('label', 'Close metadata',
            'Close metadata aria should be present when metadata tab is open.');
        assert.dom('[data-test-metadata-button] > svg').hasClass('fa-info-circle',
            'Button should have info circle Font Awesome 5 icon present.');

        // File Metadata
        assert.dom('[data-test-metadata-header]').hasText('File Metadata',
            'File metadata header is properly set.');
        // Title
        assert.dom('[data-test-file-title-label]').hasText('Title',
            'File metadata title label text is properly set.');
        assert.dom('[data-test-file-title]').exists();
        // Description
        assert.dom('[data-test-file-description-label]').hasText('Description',
            'File metadata description label text is properly set.');
        assert.dom('[data-test-file-description]').exists();
        // Resource type
        assert.dom('[data-test-file-resource-type-label]').hasText('Resource type',
            'File metadata resource type text is properly set.');
        assert.dom('[data-test-file-resource-type]').exists();
        // Resource language
        assert.dom('[data-test-file-language-label]').hasText('Resource language',
            'File metadata resource language text is properly set.');
        assert.dom('[data-test-file-language]').exists();

        // Node metadata
        const nodeNounElement = document.querySelectorAll('[data-test-metadata-node]')[0].textContent;
        const nounFound = nodeNoun.some(r => nodeNounElement?.includes(r));
        assert.equal(nounFound, true, 'Node noun properly set.');
        if (!this.registration.isAnonymous && (this.registration.contributors.length !== 0)) {
            // Target contributors
            assert.dom('[data-test-target-contributors-label]').hasText('Contributors',
                'File metadata contributor text is properly set.');
            assert.dom('[data-test-target-contributors]').exists();
            // Target Institutions
            assert.dom('[data-test-target-institutions-label]').hasText('Affiliated institutions',
                'File affiliated institutions text is properly set.');
            assert.dom('[data-test-target-institutions]').exists();
        }
        // Funder metadata
        if (!this.registration.isAnonymous && metadataRecord.funder) {
            assert.dom('[data-test-target-funder-div]').exists();
            for (const funder of metadataRecord.funders) {
                // Funder name
                assert.dom('[data-test-target-funder-name-label]').hasText('Funder',
                    'File metadata funder text is properly set.');
                assert.dom('[data-test-target-funder-name]').exists();
                assert.dom(`[data-test-target-funder-name="${funder.funder_name}"]`)
                    .containsText(funder.funder_name, `Funder name is unchanged for ${funder.funder_name}`);
                // Award title
                assert.dom('[data-test-target-funder-award-title-label]').hasText('Award title',
                    'File metadata award title text is properly set.');
                assert.dom('[data-test-target-funder-award-title]').exists();
                assert.dom(`[data-test-target-funder-award-title="${funder.award_title}"]`)
                    .containsText(funder.award_title, `Funder award title is unchanged for ${funder.funder_name}`);
                // Award URI
                assert.dom('[data-test-target-funder-award-uri-label]').hasText('Award URI',
                    'File metadata award URI text is properly set.');
                assert.dom('[data-test-target-funder-award-uri]').exists();
                assert.dom(`[ data-test-target-funder-award-uri="${funder.award_uri}"]`)
                    .containsText(funder.award_uri, `Funder award URI is unchanged for ${funder.funder_name}`);
                // Award number
                assert.dom('[data-test-target-funder-award-number-label]').hasText('Award number',
                    'File metadata award number text is properly set.');
                assert.dom('[data-test-target-funder-award-number]').exists();
                assert.dom(`[data-test-target-funder-award-number="${funder.award_number}"`)
                    .containsText(funder.award_number, `Funder award number is unchanged for ${funder.funder_name}`);
            }
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

    // Save and cancel buttons with write permissions
    test('save and cancel', async function(this: ThisTestContext, assert) {
        await visit(`/--file/${this.file.id}`);
        assert.equal(currentURL(), `/--file/${this.file.guid}`);

        // Verify download
        if (!this.registration.isAnonymous) {
            assert.dom('[data-test-download-button]').exists();
        }

        // Verify edit
        if (this.file.target.currentUserPermissions.includes(Permission.Write)) {
            await click('[data-test-edit-metadata-button]');
            assert.dom('[data-test-title-field]').exists();
            assert.dom('[data-test-description-field]').exists();
            assert.dom('[data-test-select-resource-type]').exists();
            assert.dom('[data-test-select-resource-language]').exists();
            assert.dom('[data-test-cancel-editing-metadata-button]').exists();
            assert.dom('[data-test-save-metadata-button]').exists();
            await click('[data-test-cancel-editing-metadata-button]');
            assert.dom('[data-test-edit-metadata-form]').doesNotExist();
            await click('[data-test-edit-metadata-button]');

            // Screenshot before changes
            await percySnapshot(assert);
            // Update Title
            const editTitleTextArea = document.querySelectorAll('textarea')[0];
            editTitleTextArea.textContent = 'A test title.';
            assert.dom('[data-test-title-field]')
                .containsText('A test title.', 'Metadata title field updates.');
            // Update Description
            const editDescriptionTextArea = document.querySelectorAll('textarea')[1];
            editDescriptionTextArea.textContent = 'A test description.';
            assert.dom('[data-test-title-field]')
                .containsText('A test description.', 'Metadata description field updates.');
            // Update Resource Type
            const resourceTypeDropdown = document.querySelectorAll('[data-test-power-select-dropdown]')[0];
            await click(resourceTypeDropdown);
            const resourceTypeList = document.evaluate(
                'count(//ul[@role="listbox"]/li)',
                document,
                null,
                XPathResult.ANY_TYPE, null,
            );
            const resourceTypeListLength = resourceTypeList.numberValue;            // should be in range 0-tens
            const resourceOptionRandom = Math.floor(resourceTypeListLength * Math.random() - 1);
            const resourceOption = `data-option-index="${resourceOptionRandom}"`;
            const resourceElement = document.querySelectorAll(resourceOption)[0];
            await click(resourceElement);
            // Update Resource Language
            const resourceLanguageDropdown = document.querySelectorAll('[data-test-power-select-dropdown]')[1];
            await click(resourceLanguageDropdown);
            const resourceLanguageList  = document.evaluate(
                'count(//ul[@role="listbox"]/li)',
                document,
                null,
                XPathResult.ANY_TYPE, null,
            );
            const resourceLanguageListLength = resourceLanguageList.numberValue;    // should be in range 0-hundreds
            const languageOptionRandom = Math.floor(resourceLanguageListLength * Math.random() - 1);
            const languageOption = `data-option-index="${languageOptionRandom}"`;
            const languageElement = document.querySelectorAll(languageOption)[0];
            await click(languageElement);
            // Screenshot after changes
            await percySnapshot(assert);
            // Save changes
            await click('[data-test-save-metadata-button]');
        }
        // Verify form closes
        assert.dom('[data-test-edit-metadata-form]').doesNotExist();
        assert.dom('[data-test-metadata-tab]').exists();
    });

    // Verify A11y testing
    test('a11y testing', async function(this: ThisTestContext, assert) {
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

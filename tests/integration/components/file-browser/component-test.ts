import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { TestContext, t } from 'ember-intl/test-support';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { FileItemKinds } from 'ember-osf-web/models/base-file-item';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import { setupMirage } from 'ember-cli-mirage/test-support';
import FileModel from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

interface FileBrowserTestContext extends TestContext {
    mirageNode: ModelInstance<NodeModel>;
    osfStorageProvider: ModelInstance<FileProviderModel>;
    topLevelFiles: Array<ModelInstance<FileModel>>;
    topLevelFolder: ModelInstance<FileModel>;
    secondaryLevelFiles: Array<ModelInstance<FileModel>>;
}

module('Integration | Component | file-browser', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    hooks.beforeEach(function(this: FileBrowserTestContext) {
        this.store = this.owner.lookup('service:store');
        this.mirageNode = server.create('node', 'withFiles', 'withStorage', 'currentUserAdmin');
        this.osfStorageProvider = this.mirageNode.files.models[0];
        this.topLevelFiles = server.createList('file', 2, {
            target: this.mirageNode,
            parentFolder: this.osfStorageProvider.rootFolder,
        });
        this.topLevelFolder = server.create('file', {
            target: this.mirageNode,
            parentFolder: this.osfStorageProvider.rootFolder,
            kind: FileItemKinds.Folder,
        });
        this.osfStorageProvider.rootFolder.update({ files: [...this.topLevelFiles, this.topLevelFolder] });
        this.secondaryLevelFiles = server.createList('file', 2, {
            target: this.mirageNode,
            parentFolder: this.topLevelFolder,
        });
        this.topLevelFolder.update({ files: this.secondaryLevelFiles });
    });

    test('it renders and navigates through folders',
        async function(this: FileBrowserTestContext, assert) {
            await render(hbs`
                <StorageProviderManager::StorageManager @provider={{this.osfStorageProvider}} as |manager|>
                    <FileBrowser @manager={{manager}} @enableUpload={{true}} />
                </StorageProviderManager::StorageManager>
            `);
            assert.dom('[data-test-add-new-trigger]').exists('Add new file/folder option shown');
            for (const item of this.topLevelFiles) {
                assert.dom(`[data-test-file-list-item='${item.id}'][data-test-indented='false']`)
                    .exists('Top level file exists');
            }
            assert.dom(`[data-test-file-list-item="${this.topLevelFolder.id}"]`).exists('Top level folder exists');
            // Go to nested folder
            await click(`[data-test-file-list-link="${this.topLevelFolder.id}"]`);
            for (const item of this.secondaryLevelFiles) {
                assert.dom(`[data-test-file-list-item='${item.id}'][data-test-indented='true']`)
                    .exists('Secondary level file exists');
            }
            // Back to parent using header button
            await click('[data-test-go-to-parent]');
            for (const item of this.topLevelFiles) {
                assert.dom(`[data-test-file-list-item='${item.id}'][data-test-indented='false']`)
                    .exists('Top level file exists');
            }
            assert.dom(`[data-test-file-list-item="${this.topLevelFolder.id}"]`).exists('Top level folder exists');
            // Go to nested folder again
            await click(`[data-test-file-list-link="${this.topLevelFolder.id}"]`);
            // Back to parent using breadcrumb navigation
            await click('[data-test-breadcrumb="osfstorage"]');
            for (const item of this.topLevelFiles) {
                assert.dom(`[data-test-file-list-item='${item.id}'][data-test-indented='false']`)
                    .exists('Top level file exists');
            }
            assert.dom(`[data-test-file-list-item="${this.topLevelFolder.id}"]`).exists('Top level folder exists');
        });

    test('it renders and select files/folders',
        async function(this: FileBrowserTestContext, assert) {
            await render(hbs`
                <StorageProviderManager::StorageManager @provider={{this.osfStorageProvider}} as |manager|>
                    <FileBrowser @manager={{manager}} @selectable={{true}} />
                </StorageProviderManager::StorageManager>
            `);
            assert.dom('[data-test-file-selected-count]').doesNotExist('No files selected');
            assert.dom('[data-test-bulk-copy-trigger]').doesNotExist('Bulk move button not shown');
            assert.dom('[data-test-bulk-copy-trigger]').doesNotExist('Bulk copy button not shown');
            assert.dom('[data-test-bulk-delete-trigger]').doesNotExist('Bulk delete button not shown');
            await click(`[data-test-select-folder="${this.topLevelFolder.id}"]`);
            await click(`[data-test-select-file="${this.topLevelFiles[0].id}"]`);
            assert.dom('[data-test-file-selected-count]').containsText(
                t('osf-components.file-browser.number_selected', {numberOfFilesSelected: 2} ), '2 files selected',
            );
            assert.dom('[data-test-bulk-move-trigger]').exists('Bulk move button shown');
            assert.dom('[data-test-bulk-copy-trigger]').exists('Bulk copy button shown');
            assert.dom('[data-test-bulk-delete-trigger]').exists('Bulk delete button shown');
            await click(`[data-test-select-file="${this.topLevelFiles[0].id}"]`);
            assert.dom('[data-test-file-selected-count]').containsText(
                t('osf-components.file-browser.number_selected', {numberOfFilesSelected: 1} ), '1 file selected',
            );
            await click('[data-test-clear-file-selection]');
            assert.dom('[data-test-file-selected-count]').doesNotExist('No files selected');
            assert.dom('[data-test-bulk-move-trigger]').doesNotExist('Bulk move button hidden');
            assert.dom('[data-test-bulk-copy-trigger]').doesNotExist('Bulk copy button hidden');
            assert.dom('[data-test-bulk-delete-trigger]').doesNotExist('Bulk delete button hidden');
        });

    test('it renders non-selectable lists for registrations',
        async function(this: FileBrowserTestContext, assert) {
            const mirageRegistration = server.create('registration', 'withFiles');
            this.osfStorageProvider = mirageRegistration.files.models[0];
            await render(hbs`
                <StorageProviderManager::StorageManager @provider={{this.osfStorageProvider}} as |manager|>
                    <FileBrowser @manager={{manager}} @selectable={{false}} />
                </StorageProviderManager::StorageManager>
            `);
            assert.dom('[data-test-select-folder]').doesNotExist('Folders not selectable');
            assert.dom('[data-test-select-file]').doesNotExist('Files not selectable');
            assert.dom('[data-test-add-new-trigger]').doesNotExist('Add new file/folder option not shown');
        });

    test('it renders help text for nodes',
        async function(this: FileBrowserTestContext, assert) {
            await render(hbs`
                <StorageProviderManager::StorageManager @provider={{this.osfStorageProvider}} as |manager|>
                    <FileBrowser @manager={{manager}} @enableUpload={{true}} @selectable={{true}} />
                </StorageProviderManager::StorageManager>
            `);
            await click('[data-test-file-help]');
            assert.dom('[data-test-dialog]')
                .containsText(t('osf-components.file-browser.help_modal.select'), 'File select info');
            assert.dom('[data-test-dialog]')
                .containsText(t('osf-components.file-browser.help_modal.upload'), 'Upload file info');
            assert.dom('[data-test-dialog]')
                .containsText(t('osf-components.file-browser.help_modal.create_folder'), 'Create folder info');
            assert.dom('[data-test-dialog]')
                .containsText(t('osf-components.file-browser.help_modal.move'), 'Move info');
            assert.dom('[data-test-dialog]')
                .containsText(t('osf-components.file-browser.help_modal.copy'), 'Copy info');
            assert.dom('[data-test-dialog]')
                .containsText(t('osf-components.file-browser.help_modal.download_file'), 'Download info');
            assert.dom('[data-test-dialog]').containsText(
                stripHtmlTags(t('osf-components.file-browser.help_modal.more_info_projects')).toString(),
                'Project help guide',
            );
        });

    test('it renders help text for registrations',
        async function(this: FileBrowserTestContext, assert) {
            const mirageRegistration = server.create('registration', 'withFiles');
            this.osfStorageProvider = mirageRegistration.files.models[0];
            await render(hbs`
                <StorageProviderManager::StorageManager @provider={{this.osfStorageProvider}} as |manager|>
                    <FileBrowser @manager={{manager}} @selectable={{false}} />
                </StorageProviderManager::StorageManager>
            `);
            await click('[data-test-file-help]');
            assert.dom('[data-test-dialog]')
                .doesNotContainText(t('osf-components.file-browser.help_modal.select'), 'No file select info');
            assert.dom('[data-test-dialog]')
                .doesNotContainText(t('osf-components.file-browser.help_modal.upload'), 'no upload file info');
            assert.dom('[data-test-dialog]')
                .doesNotContainText(t('osf-components.file-browser.help_modal.create_folder'), 'No create folder info');
            assert.dom('[data-test-dialog]')
                .doesNotContainText(t('osf-components.file-browser.help_modal.move'), 'No move info');
            assert.dom('[data-test-dialog]')
                .doesNotContainText(t('osf-components.file-browser.help_modal.copy'), 'No copy info');
            assert.dom('[data-test-dialog]')
                .containsText(t('osf-components.file-browser.help_modal.download_file'), 'Download info');
            assert.dom('[data-test-dialog]').containsText(
                stripHtmlTags(t('osf-components.file-browser.help_modal.more_info_registrations')).toString(),
                'Registration help guide',
            );
        });
});

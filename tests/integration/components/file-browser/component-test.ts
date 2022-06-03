import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { TestContext, t } from 'ember-intl/test-support';
import { MirageRegistration } from 'ember-osf-web/mirage/factories/registration';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { FileItemKinds } from 'ember-osf-web/models/base-file-item';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import { setupMirage } from 'ember-cli-mirage/test-support';
import FileModel from 'ember-osf-web/models/file';

interface FileBrowserTestContext extends TestContext {
    mirageRegistration: ModelInstance<MirageRegistration>;
    osfStorageProvider: FileProviderModel;
    topLevelFiles: Array<ModelInstance<FileModel>>;
    topLevelFolder: ModelInstance<FileModel>;
    secondaryLevelFiles: Array<ModelInstance<FileModel>>;
}

module('Integration | Component | file-browser', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    hooks.beforeEach(function(this: FileBrowserTestContext) {
        this.store = this.owner.lookup('service:store');
        this.mirageRegistration = server.create('registration');
        const osfStorage = this.mirageRegistration.files.models[0];
        this.topLevelFiles = server.createList('file', 2, {
            target: this.mirageRegistration,
            parentFolder: osfStorage.rootFolder,
        });
        this.topLevelFolder = server.create('file', {
            target: this.mirageRegistration,
            parentFolder: osfStorage.rootFolder,
            kind: FileItemKinds.Folder,
        });
        osfStorage.rootFolder.update({ files: [...this.topLevelFiles, this.topLevelFolder] });
        this.secondaryLevelFiles = server.createList('file', 2, {
            target: this.mirageRegistration,
            parentFolder: this.topLevelFolder,
        });
        this.topLevelFolder.update({ files: this.secondaryLevelFiles });
    });

    test('it renders and navigates through folders',
        async function(this: FileBrowserTestContext, assert) {
            const registration = await this.store.findRecord('registration', this.mirageRegistration.id);
            const storageProviders = await registration.files;
            this.osfStorageProvider = storageProviders.toArray()[0];
            await render(hbs`
                <StorageProviderManager::StorageManager @provider={{this.osfStorageProvider}} as |manager|>
                    <FileBrowser @manager={{manager}} />
                </StorageProviderManager::StorageManager>
            `);
            for (const item of this.topLevelFiles) {
                assert.dom(`[data-test-file-list-item='${item.id}'][data-test-indented='false']`)
                    .exists('Top level file exists');
            }
            assert.dom(`[data-test-file-list-item="${this.topLevelFolder.id}"]`).exists('Top level folder exists');
            // Go to nested folder
            await click(`[data-test-file-list-item="${this.topLevelFolder.id}"] > button`);
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
            await click(`[data-test-file-list-item="${this.topLevelFolder.id}"] > button`);
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
            const registration = await this.store.findRecord('registration', this.mirageRegistration.id);
            const storageProviders = await registration.files;
            this.osfStorageProvider = storageProviders.toArray()[0];
            await render(hbs`
                <StorageProviderManager::StorageManager @provider={{this.osfStorageProvider}} as |manager|>
                    <FileBrowser @manager={{manager}} @selectable={{true}} />
                </StorageProviderManager::StorageManager>
            `);
            assert.dom('[data-test-file-selected-count]').doesNotExist('No files selected');
            await click(`[data-test-select-folder="${this.topLevelFolder.id}"]`);
            await click(`[data-test-select-file="${this.topLevelFiles[0].id}"]`);
            assert.dom('[data-test-file-selected-count]').containsText(
                t('osf-components.file-browser.number_selected', {numberOfFilesSelected: 2} ), '2 files selected',
            );
            await click(`[data-test-select-file="${this.topLevelFiles[0].id}"]`);
            assert.dom('[data-test-file-selected-count]').containsText(
                t('osf-components.file-browser.number_selected', {numberOfFilesSelected: 1} ), '1 file selected',
            );
            await click('[data-test-clear-file-selection]');
            assert.dom('[data-test-file-selected-count]').doesNotExist('No files selected');
        });
});

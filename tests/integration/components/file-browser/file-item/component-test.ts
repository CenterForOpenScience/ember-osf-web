import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { t, TestContext } from 'ember-intl/test-support';
import { MirageRegistration } from 'ember-osf-web/mirage/factories/registration';
import FileModel from 'ember-osf-web/models/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import { FileItemKinds } from 'ember-osf-web/models/base-file-item';
import { click } from 'ember-osf-web/tests/helpers';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import Service from '@ember/service';

interface Links {
    html: string;
    download: string;
}

interface FileItem {
    name: string;
    links: Links;
    dateModified: string;
    id: string;
    disabled: false;
}

interface Manager {
    parentFolder: any;
    selectFile: () => void;
    goToFolder: () => void;
    selectedFiles: any[];
    targetNode: any;
}

interface FileItemTestContext extends TestContext {
    item: FileItem;
    manager: Manager;
    provider: FileProviderModel;
    mirageRegistration: ModelInstance<MirageRegistration>;
    osfStorageProvider: FileProviderModel;
    topLevelFiles: Array<ModelInstance<FileModel>>;
    topLevelFolder: ModelInstance<FileModel>;
    secondaryLevelFiles: Array<ModelInstance<FileModel>>;
    currentFileName: string;
    newFileName: string;
    disabled: Boolean;
    renameModalOpen: boolean;
    inputValue: string;
    closeRenameModal: (
        name: string,
    ) => void;
}

const currentUserStub = Service.extend();
const sessionStub = Service.extend({
    isAuthenticated: true,
});
const storeStub = Service.extend();
const themeStub = Service.extend();
const headTagsStub = Service.extend();

module('Integration | Component | file-browser :: file-item', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    hooks.beforeEach(function(this: FileItemTestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:theme', themeStub);
        this.owner.register('service:head-tags', headTagsStub);
        this.set('renameModalOpen', () => true);
        this.set('isOpen', () => true);
        this.set('disabled', () => true);
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
            name: 'TestName',
        });
        osfStorage.rootFolder.update({ files: [...this.topLevelFiles, this.topLevelFolder] });
        this.secondaryLevelFiles = server.createList('file', 2, {
            target: this.mirageRegistration,
            parentFolder: this.topLevelFolder,
        });
        this.topLevelFolder.update({ files: this.secondaryLevelFiles });
        this.item = {
            id: 'fakeId',
            name: 'Push&Pull',
            links: {
                html: 'thisisafakelink',
                download: 'thisisafakedownloadlink',
            },
            dateModified: Date(),
            disabled: false,
        };
        this.manager = {
            parentFolder: null,
            selectFile: () => { /* noop */ },
            goToFolder: () => { /* noop */ },
            selectedFiles: [],
            targetNode: 'fakeNode',
        };
    });

    hooks.afterEach(function(this: FileItemTestContext) {
        this.set('renameModalOpen', () => false);
        this.set('isOpen', () => false);
    });

    test('it renders as non-indented when the manager has no parentFolder',
        async function(this: FileItemTestContext, assert) {
            await render(hbs`<FileBrowser::FileItem @manager={{this.manager}} @item={{this.item}} />`);
            assert.dom('[data-test-indented="false"][data-test-file-list-item]').exists('File item exists');
            assert.dom('[data-test-file-name]').exists('File name exists');
            assert.dom('[data-test-file-name]').hasText('TestName', 'File name is correct');
            assert.dom('[data-test-file-modified-date]').exists('Modified date exists');
            assert.dom('[data-test-file-modified-date]').hasText(
                moment(this.item.dateModified).format('YYYY-MM-DD hh:mm A'),
            );
            assert.dom('[data-test-file-download-share-trigger]').exists('Download/share/embed button exists');
            await click('[data-test-file-download-share-trigger]');
            assert.dom('[data-test-download-button]').exists('Download button exists');
            assert.dom('[data-test-embed-button]').exists('Embed button exists');
            assert.dom('[data-test-social-sharing-button]').exists('Share button exists');
        });

    test('it renders as indented when the manager has parentFolder',
        async function(this: FileItemTestContext, assert) {
            this.manager.parentFolder = 'fakeParentFolder';
            await render(hbs`<FileBrowser::FileItem @manager={{this.manager}} @item={{this.item}} />`);
            assert.dom('[data-test-indented="true"][data-test-file-list-item]').exists('File item exists');
            assert.dom('[data-test-file-name]').exists('File name exists');
            assert.dom('[data-test-file-name]').hasText('TestName', 'File name is correct');
            assert.dom('[data-test-file-modified-date]').exists('Modified date exists');
            assert.dom('[data-test-file-modified-date]').hasText(
                moment(this.item.dateModified).format('YYYY-MM-DD hh:mm A'),
            );
            assert.dom('[data-test-file-download-share-trigger]').exists('Download/share/embed button exists');
            await click('[data-test-file-download-share-trigger]');
            assert.dom('[data-test-download-button]').exists('Download button exists');
            assert.dom('[data-test-embed-button]').exists('Embed button exists');
            assert.dom('[data-test-social-sharing-button]').exists('Share button exists');
        });

    test('it renders with disabled Save button when name is same',
        async function(this: FileItemTestContext, assert) {
            this.set('disabled', () => true);
            this.set('currentFileName', 'TestName');
            this.set('newFileName', 'TestName');
            await render(hbs`<FileBrowser::FileRenameModal
            @isOpen={{this.renameModalOpen}}
            @onClose={{this.closeRenameModal}}
            @item={{this.item}}
            @manager={{this.manager}}
            @disabled={{true}}
        />`);
            assert.dom('[data-test-file-rename-modal]').exists('File rename modal exists');
            assert.dom('[data-test-rename-heading]').exists('File rename heading present');
            assert.dom('[data-test-rename-heading]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.heading'),
            ));

            assert.dom('[data-test-cancel-button]').exists('Cancel button exists');
            assert.dom('[data-test-cancel-button]').hasText(stripHtmlTags(t(
                'registries.overview.files.file_rename_modal.cancel',
            )));
            assert.dom('[data-test-disabled-rename]').hasAttribute('disabled');
            assert.dom('[data-test-disabled-rename]').exists('Disabled save button exists');
            assert.dom('[data-test-disabled-rename]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.save'),
            ));
            await click('[data-test-cancel-button]');
        });

    test('it renders with enabled Save button when name is different',
        async function(this: FileItemTestContext, assert) {
            this.set('currentFileName', 'OriginalNameTwo');
            this.set('newFileName', 'NewNameTwo');
            this.item.name = this.newFileName;
            await render(hbs`<FileBrowser::FileRenameModal
            @isOpen={{this.renameModalOpen}}
            @onClose={{this.closeRenameModal}}
            @item={{this.item}}
            @manager={{this.manager}}
            @disabled={{false}}
            />`);
            this.set('disabled', () => false);
            assert.dom('[data-test-file-rename-modal]').exists('File rename modal exists');
            assert.dom('[data-test-rename-heading]').exists('File rename heading present');
            assert.dom('[data-test-rename-heading]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.heading'),
            ));
            assert.dom('[data-test-cancel-button]').exists('Cancel button exists');
            assert.dom('[data-test-cancel-button]').hasText(stripHtmlTags(t(
                'registries.overview.files.file_rename_modal.cancel',
            )));
            assert.dom('[data-test-enabled-rename]').hasAttribute('enabled');
            // assert.dom('[data-test-enabled-rename]').exists('Disabled save button exists');
            assert.dom('[data-test-enabled-rename]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.save'),
            ));
            await click('[data-test-cancel-button]');
        });
});

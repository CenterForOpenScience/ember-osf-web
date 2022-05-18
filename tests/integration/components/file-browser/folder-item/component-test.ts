import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext } from 'ember-intl/test-support';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

interface Links {
    html: string;
    download: string;
}

interface FileItem {
    name: string;
    links: Links;
    dateModified: string;
    id: string;
    userCanDownloadAsZip: boolean;
}

interface Manager {
    parentFolder: any;
    selectFile: () => void;
    goToFolder: () => void;
}

interface FolderItemTestContext extends TestContext {
    item: FileItem;
    manager: Manager;
}

module('Integration | Component | file-browser :: folder-item', hooks => {
    setupRenderingTest(hooks);
    hooks.beforeEach(function(this: FolderItemTestContext) {
        this.item = {
            id: 'fakeId',
            name: 'Push&Pull',
            links: {
                html: 'thisisafakelink',
                download: 'thisisafakedownloadlink',
            },
            dateModified: Date(),
            userCanDownloadAsZip: true,
        };
        this.manager = {
            parentFolder: null,
            selectFile: () => { /* noop */ },
            goToFolder: () => { /* noop */ },
        };
    });

    test('it renders as non-indented when the manager has no parentFolder',
        async function(this: FolderItemTestContext, assert) {
            await render(hbs`<FileBrowser::FolderItem @manager={{this.manager}} @item={{this.item}} />`);
            assert.dom('[data-test-indented="false"][data-test-file-list-item]').exists('File item exists');
            assert.dom('[data-test-folder-name]').exists('Folder name exists');
            assert.dom('[data-test-folder-name]').hasText(this.item.name, 'Folder name is correct');
            assert.dom('[data-test-file-download-share-trigger]').exists('Download/share button exists');
            await click('[data-test-file-download-share-trigger]');
            assert.dom('[data-test-download-button]').exists('Download button exists');
        });

    test('it renders as indented when the manager has parentFolder',
        async function(this: FolderItemTestContext, assert) {
            this.manager.parentFolder = 'fakeParentFolder';
            await render(hbs`<FileBrowser::FolderItem @manager={{this.manager}} @item={{this.item}} />`);
            assert.dom('[data-test-indented="true"][data-test-file-list-item]').exists('File item exists');
            assert.dom('[data-test-folder-name]').exists('Folder name exists');
            assert.dom('[data-test-folder-name]').hasText(this.item.name, 'Folder name is correct');
            assert.dom('[data-test-file-download-share-trigger]').exists('Download/share button exists');
            await click('[data-test-file-download-share-trigger]');
            assert.dom('[data-test-download-button]').exists('Download button exists');
        });
});

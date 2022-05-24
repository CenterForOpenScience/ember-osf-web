import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext } from 'ember-intl/test-support';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
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
}

module('Integration | Component | file-browser :: file-item', hooks => {
    setupRenderingTest(hooks);
    hooks.beforeEach(function(this: FileItemTestContext) {
        this.item = {
            id: 'fakeId',
            name: 'Push&Pull',
            links: {
                html: 'thisisafakelink',
                download: 'thisisafakedownloadlink',
            },
            dateModified: Date(),
        };
        this.manager = {
            parentFolder: null,
            selectFile: () => { /* noop */ },
            goToFolder: () => { /* noop */ },
            selectedFiles: [],
            targetNode: 'fakeNode',
        };
    });

    test('it renders as non-indented when the manager has no parentFolder',
        async function(this: FileItemTestContext, assert) {
            await render(hbs`<FileBrowser::FileItem @manager={{this.manager}} @item={{this.item}} />`);
            assert.dom('[data-test-indented="false"][data-test-file-list-item]').exists('File item exists');
            assert.dom('[data-test-file-name]').exists('File name exists');
            assert.dom('[data-test-file-name]').hasText(this.item.name, 'File name is correct');
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
            assert.dom('[data-test-file-name]').hasText(this.item.name, 'File name is correct');
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
});

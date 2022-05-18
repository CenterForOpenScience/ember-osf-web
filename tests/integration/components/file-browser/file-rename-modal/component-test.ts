import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t, TestContext } from 'ember-intl/test-support';
import { click } from 'ember-osf-web/tests/helpers';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';
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
}

interface Manager {
    parentFolder: any;
}

interface FileRenameModalTestContext extends TestContext {
    manager: Manager;
    item: FileItem;
}

module('Integration | Component | file-browser :: file-rename-modal', hooks => {
    setupRenderingTest(hooks);
    hooks.beforeEach(function(this: FileRenameModalTestContext) {
        this.item = {
            id: 'fakeId',
            name: 'FileRenameModalTest',
            links: {
                html: 'thisisafakelink',
                download: 'thisisafakedownloadlink',
            },
            dateModified: Date(),
        };
        this.manager = {
            parentFolder: null,
        };
    });

    test('it renders with a disabled button when name is the same',
        async function(this: FileRenameModalTestContext, assert) {
            await render(hbs`<FileBrowser::FileRenameModal @manager={{this.manager}} @item={{this.item}} />`);
            assert.dom('[data-test-file-rename-modal]').exists('File rename modal exists');
            assert.dom('[data-test-rename-heading]').exists('File rename heading present');
            assert.dom('[data-test-rename-heading]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.heading'),
            ));
            assert.dom('[data-test-user-input]').hasText(this.item.name, 'File name pre-populated');
            assert.dom('[data-test-cancel-button]').exists('Cancel button exists');
            assert.dom('[data-test-cancel-button]').hasText(stripHtmlTags(t(
                'registries.overview.files.file_rename_modal.cancel',
            )));
            assert.dom('[data-test-disabled-rename]').exists('Disabled save button exists');
            assert.dom('[data-test-disabled-rename]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.save'),
            ));
            await click('[data-test-cancel-button]');
            assert.dom('[data-test-rename-link]').exists('Rename link exists');
        });

    test('it renders with enabled Save button when name is different',
        async function(this: FileRenameModalTestContext, assert) {
            await render(hbs`<FileBrowser::FileRenameModal @manager={{this.manager}} @item={{this.item}} />`);
            assert.dom('[data-test-file-rename-modal]').exists('File rename modal exists');
            assert.dom('[data-test-rename-heading]').exists('File rename heading present');
            assert.dom('[data-test-rename-heading]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.heading'),
            ));
            assert.dom('[data-test-user-input]').hasText(this.item.name, 'File name pre-populated');
            assert.dom('[data-test-cancel-button]').exists('Cancel button exists');
            assert.dom('[data-test-cancel-button]').hasText(stripHtmlTags(t(
                'registries.overview.files.file_rename_modal.cancel',
            )));
            assert.dom('[data-test-enabled-rename]').exists('Disabled save button exists');
            assert.dom('[data-test-enabled-rename]').hasText(stripHtmlTags(
                t('registries.overview.files.file_rename_modal.save'),
            ));
            await click('[data-test-cancel-button]');
            assert.dom('[data-test-rename-link]').exists('Rename link exists');
        });
});

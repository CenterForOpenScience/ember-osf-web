import { render } from '@ember/test-helpers';
import fillIn from '@ember/test-helpers/dom/fill-in';
import { hbs } from 'ember-cli-htmlbars';
import { t, TestContext } from 'ember-intl/test-support';
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

    test('it renders with a disabled button when name is the same, button enabled whem name is different',
        async function(this: FileRenameModalTestContext, assert): Promise<void> {
            await render(
                hbs`<FileBrowser::FileRenameModal @manager={{this.manager}} @item={{this.item}} @isOpen={{true}} />`,
            );
            assert.dom('[data-test-file-rename-modal]').exists('File rename modal exists');
            assert.dom('[data-test-rename-heading]').exists('File rename heading present');
            assert.dom('[data-test-rename-heading]').hasText(stripHtmlTags(
                t('osf-components.file-browser.file_rename_modal.heading'),
            ));
            assert.dom('[data-test-user-input]').hasValue(this.item.name, 'File name pre-populated');
            assert.dom('[data-test-cancel-button]').exists('Cancel button exists');
            assert.dom('[data-test-cancel-button]').hasText(stripHtmlTags(t(
                'osf-components.file-browser.file_rename_modal.cancel',
            )));
            assert.dom('[data-test-disabled-rename]').exists('Save button exists');
            assert.dom('[data-test-disabled-rename]').isDisabled('Save button is disabled');
            assert.dom('[data-test-disabled-rename]').hasText(stripHtmlTags(
                t('osf-components.file-browser.file_rename_modal.save'),
            ));
            assert.dom('[data-test-rename-main]').containsText(
                t('osf-components.file-browser.file_rename_modal.error_message'),
            );

            await fillIn('[data-test-user-input]', 'What is the great globe itself but a Loose-Fish?');
            assert.dom('[data-test-rename-main]').containsText(
                t('osf-components.file-browser.file_rename_modal.error_forbidden_chars'),
            );

            await fillIn('[data-test-user-input]', '      ');
            assert.dom('[data-test-rename-main]').containsText(
                t('osf-components.file-browser.file_rename_modal.error_message'),
            );

            await fillIn('[data-test-user-input]', 'This will error.');
            assert.dom('[data-test-rename-main]').containsText(
                t('osf-components.file-browser.file_rename_modal.error_ends_with_dot'),
            );

            await fillIn('[data-test-user-input]', 'Save this file');
            assert.dom('[data-test-disabled-rename]').isEnabled('Save button is enabled');
        });
});

import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext, t } from 'ember-intl/test-support';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
import { module, test } from 'qunit';

import styles from 'osf-components/components/file-browser/file-item/styles';

interface Links {
    html: string;
    download: string;
}

interface FileItem {
    name: string;
    displayName: string;
    links: Links;
    dateModified: string;
    id: string;
    providerSpecificData?: any;
    isCheckedOut?: boolean;
    showAsUnviewed?: boolean;
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
            displayName: 'Push&Pull',
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
            await render(
                hbs`<FileBrowser::FileItem @manager={{this.manager}} @item={{this.item}} @isDesktop={{true}} />`,
            );
            assert.dom('[data-test-indented="false"][data-test-file-list-item]').exists('File item exists');
            assert.dom('[data-test-file-name]').exists('File name exists');
            assert.dom('[data-test-file-name]').hasText(this.item.displayName, 'File name is correct');
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
            await render(
                hbs`<FileBrowser::FileItem @manager={{this.manager}} @item={{this.item}} @isDesktop={{true}} />`,
            );
            assert.dom('[data-test-indented="true"][data-test-file-list-item]').exists('File item exists');
            assert.dom('[data-test-file-name]').exists('File name exists');
            assert.dom('[data-test-file-name]').hasText(this.item.displayName, 'File name is correct');
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

    test('it renders checked-out file', async function(this: FileItemTestContext, assert) {
        this.manager.parentFolder = 'fakeParentFolder';
        this.item.isCheckedOut = true;
        await render(
            hbs`<FileBrowser::FileItem @manager={{this.manager}} @item={{this.item}} @isDesktop={{true}} />`,
        );
        assert.dom('[data-test-file-list-checkout]').exists('Checkout icon exists');
        assert.dom('[data-test-file-list-link]').hasAria('label',
            t('osf-components.file-browser.view_file', { fileName: this.item.displayName }), 'Correct aria-label');
        assert.dom('[data-test-file-list-link]').doesNotHaveClass(styles.Unviewed, 'Link is not styled as unviewed');
        assert.dom('[data-test-file-list-link]').hasText(this.item.displayName, 'Link has correct text');
    });

    test('it renders unviewed file', async function(this: FileItemTestContext, assert) {
        this.manager.parentFolder = 'fakeParentFolder';
        this.item.showAsUnviewed = true;
        await render(
            hbs`<FileBrowser::FileItem @manager={{this.manager}} @item={{this.item}} @isDesktop={{true}} />`,
        );
        assert.dom('[data-test-file-list-checkout]').doesNotExist('Checkout icon does not exist');
        assert.dom('[data-test-file-list-link]').hasAria('label',
            t('osf-components.file-browser.view_unseen_file', { fileName: this.item.displayName }),
            'Correct aria-label');
        assert.dom('[data-test-file-list-link]').hasClass(styles.Unviewed, 'Link is styled as unviewed');
        assert.dom('[data-test-file-list-link]').hasText(this.item.displayName, 'Link has correct text');
    });
});

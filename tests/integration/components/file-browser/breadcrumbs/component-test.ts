import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';

import { module, test } from 'qunit';

interface FakeBreadcrumb {
    name: string;
}

interface BreadcrumbTestContext extends TestContext {
    provider: FakeBreadcrumb;
    folderOne: FakeBreadcrumb;
    folderTwo: FakeBreadcrumb;
}

module('Integration | Component | file-browser / breadcrumbs', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: BreadcrumbTestContext) {
        this.provider = {name: 'osfstorage'};
        this.folderOne = {name: 'folder_one'};
        this.folderTwo = {name: 'folder_two'};
    });

    test('it renders with one item', async function(this: BreadcrumbTestContext, assert) {
        const breadcrumbs = [
            this.provider,
        ];

        this.set('manager', {breadcrumbs, currentFolder: this.provider});
        await render(hbs`<FileBrowser::Breadcrumbs @manager={{this.manager}} />`);
        assert.dom('[data-test-breadcrumb="osfstorage"]')
            .exists();
        assert.dom('[data-test-breadcrumb="osfstorage"]')
            .doesNotHaveAttribute('href');
        assert.dom('[data-test-breadcrumb="folder_one"]')
            .doesNotExist();
        assert.dom('[data-test-breadcrumb="folder_two"]')
            .doesNotExist();
    });

    test('it renders with two items', async function(this: BreadcrumbTestContext, assert) {
        const breadcrumbs = [
            this.provider,
            this.folderOne,
        ];

        this.set('manager', {breadcrumbs, currentFolder: this.folderOne});
        await render(hbs`<FileBrowser::Breadcrumbs @manager={{this.manager}} />`);
        assert.dom('[data-test-breadcrumb="osfstorage"]')
            .exists();
        assert.dom('[data-test-breadcrumb="osfstorage"]')
            .hasAttribute('href');
        assert.dom('[data-test-breadcrumb="folder_one"]')
            .exists();
        assert.dom('[data-test-breadcrumb="folder_one"]')
            .doesNotHaveAttribute('href');
        assert.dom('[data-test-breadcrumb="folder_two"]')
            .doesNotExist();
    });


    test('it renders with more than two items', async function(this: BreadcrumbTestContext, assert) {
        const breadcrumbs = [
            this.provider,
            this.folderOne,
            this.folderTwo,
        ];

        this.set('manager', {breadcrumbs, currentFolder: this.folderTwo});
        await render(hbs`<FileBrowser::Breadcrumbs @manager={{this.manager}} />`);
        assert.dom('[data-test-breadcrumb="osfstorage"]')
            .exists();
        assert.dom('[data-test-breadcrumb="osfstorage"]')
            .hasAttribute('href');
        assert.dom('[data-test-breadcrumb="folder_one"]')
            .exists();
        assert.dom('[data-test-breadcrumb="folder_one"]')
            .hasAttribute('href');
        assert.dom('[data-test-breadcrumb="folder_two"]')
            .exists();
        assert.dom('[data-test-breadcrumb="folder_two"]')
            .doesNotHaveAttribute('href');
    });
});

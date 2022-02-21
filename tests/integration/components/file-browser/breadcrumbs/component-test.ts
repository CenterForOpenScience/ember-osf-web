import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';

import { module, test } from 'qunit';

module('Integration | Component | file-browser / breadcrumbs', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        const breadcrumbsOne = [
            {
                name: 'osfstorage',
            },
        ];
        const breadcrumbsTwo = [
            {name: 'osfstorage'},
            {name: 'folder_one'},
        ];
        const breadcrumbsThree = [
            {name: 'osfstorage'},
            {name: 'folder_one'},
            {name: 'folder_two'},
        ];

        this.set('manager', {breadcrumbs: breadcrumbsOne});
        await render(hbs`<FileBrowser::Breadcrumbs @manager={{this.manager}} />`);
        assert.dom('[data-test-go-to-folder="osfstorage"]')
            .exists();
        assert.dom('[data-test-go-to-folder="folder_one"]')
            .doesNotExist();
        assert.dom('[data-test-go-to-folder="folder_two"]')
            .doesNotExist();

        this.set('manager', {breadcrumbs: breadcrumbsTwo});
        await render(hbs`<FileBrowser::Breadcrumbs @manager={{this.manager}} />`);
        assert.dom('[data-test-go-to-folder="osfstorage"]')
            .exists();
        assert.dom('[data-test-go-to-folder="folder_one"]')
            .exists();
        assert.dom('[data-test-go-to-folder="folder_two"]')
            .doesNotExist();

        this.set('manager', {breadcrumbs: breadcrumbsThree});
        await render(hbs`<FileBrowser::Breadcrumbs @manager={{this.manager}} />`);
        assert.dom('[data-test-go-to-folder="osfstorage"]')
            .exists();
        assert.dom('[data-test-go-to-folder="folder_one"]')
            .exists();
        assert.dom('[data-test-go-to-folder="folder_two"]')
            .exists();
    });
});

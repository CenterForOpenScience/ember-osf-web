import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';

import { module, test } from 'qunit';

module('Integration | Component | file-browser / breadcrumbs', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        const breadcrumbsOne = [
            {name: 'osfstorage'},
        ];
        const breadcrumbsTwo = [
            {name: 'osfstorage'},
            {name: 'folder one'},
        ];
        const breadcrumbsThree = [
            {name: 'osfstorage'},
            {name: 'folder one'},
            {name: 'folder two'},
        ];

        this.set('breadcrumbs', breadcrumbsOne);
        await render(hbs`<FileBrowser::Breadcrumbs @breadcrumbs={{this.breadcrumbs}} />`);
        assert.dom('[data-test-breadcrumbs]')
            .hasText('OSF Storage', 'Breadcrumbs render properly with just storage provider');

        this.set('breadcrumbs', breadcrumbsTwo);
        await render(hbs`<FileBrowser::Breadcrumbs @breadcrumbs={{this.breadcrumbs}} />`);
        assert.dom('[data-test-breadcrumbs]')
            .hasText('OSF Storage > folder one', 'Breadcrumbs render properly with provider and one folder');

        this.set('breadcrumbs', breadcrumbsThree);
        await render(hbs`<FileBrowser::Breadcrumbs @breadcrumbs={{this.breadcrumbs}} />`);
        assert.dom('[data-test-breadcrumbs]')
            .hasText(
                'OSF Storage > folder one > folder two',
                'Breadcrumbs render properly with provider and two folders',
            );
    });
});

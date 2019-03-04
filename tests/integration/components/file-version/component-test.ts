import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | file-version', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Tests that the file-version table renders when given the right data

        const version = {
            id: 1,
            attributes: {
                modified_utc: '2017-10-06T18:23:50+00:00',
                extra: {
                    downloads: 10,
                },
            },
        };

        this.set('version', version);

        await render(hbs`{{file-version version=version}}`);

        assert.dom('[data-test-version-cell]')
            .hasText('1', 'Version cell displays the id.');

        assert.dom('[data-test-modified-date-cell]')
            .includesText('2017-10-06', 'The second list element displays the file date.');

        assert.dom('[data-test-download-count-cell]')
            .hasText('10', 'The third list element displays the download count.');
    });
});

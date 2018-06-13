import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
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

        assert.hasText(
            '.file-version > :nth-child(1)',
            '1',
            'The first list element displays the id.',
        );

        assert.includesText(
            '.file-version > :nth-child(2)',
            '2017-10-06',
            'The second list element displays the file date.',
        );

        assert.hasText(
            '.file-version > :nth-child(3)',
            '10',
            'The third list element displays the download count.',
        );
    });
});

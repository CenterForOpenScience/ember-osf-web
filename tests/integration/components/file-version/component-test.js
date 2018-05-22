import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | file version', function(hooks) {
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

        const child1text = this.$('.file-version').children().eq(0).text();
        assert.equal(child1text.trim(), '1', 'The first element should be the id, which is 1');

        const child2text = this.$('.file-version').children().eq(1).text();
        assert.ok(child2text.indexOf('2017-10-06') !== -1, 'Second list element should be a label with the file date');

        const result = this.$('.file-version').children().eq(2).text();
        assert.equal(result, 10, 'Third list element should be a label with the download count - which is 10');
    });
});

import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | file-share-button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{file-share-button}}`);
        assert.dom('button').hasText('Share');
    });
});

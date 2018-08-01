import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import 'qunit-dom';

module('Integration | Component | file-share-button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{file-share-button}}`);
        assert.dom('button').hasText('Share');
    });
});

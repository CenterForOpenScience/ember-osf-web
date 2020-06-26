import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | dropzone-widget', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{dropzone-widget}}`);
        assert.dom('div.dz-message').hasText('Drop files here to upload');
    });
});

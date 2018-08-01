import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import 'qunit-dom';

module('Integration | Component | dropzone-widget', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{dropzone-widget}}`);
        assert.dom('div.dz-message').hasText('Drop files here to upload');
    });
});

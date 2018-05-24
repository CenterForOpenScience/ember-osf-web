import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | dropzone widget', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{dropzone-widget}}`);
        assert.hasText('div.dz-message', 'Drop files here to upload');
    });
});

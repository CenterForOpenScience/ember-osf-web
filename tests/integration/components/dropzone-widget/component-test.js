import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | dropzone widget', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.on('myAction', function(val) { ... });

        await render(hbs`{{dropzone-widget}}`);

        assert.equal(this.$().text().trim(), 'Drop files here to upload');
    });
});

import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | delete-node-button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{delete-node-button}}`);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
            {{#delete-node-button}}
                template block text
            {{/delete-node-button}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});

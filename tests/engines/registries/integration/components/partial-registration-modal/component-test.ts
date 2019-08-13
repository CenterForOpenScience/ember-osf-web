import { render } from '@ember/test-helpers';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | partial-registration-modal', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{partial-registration-modal}}`);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
            {{#partial-registration-modal}}
                template block text
            {{/partial-registration-modal}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});

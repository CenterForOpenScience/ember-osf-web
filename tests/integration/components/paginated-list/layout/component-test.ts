import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | paginated-list/layout', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{paginated-list/layout}}`);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
            {{#paginated-list/layout}}
                template block text
            {{/paginated-list/layout}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});

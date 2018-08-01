import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import 'qunit-dom';

module('Integration | Component | paginated-relation/x-render', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{paginated-relation/x-render}}`);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
            {{#paginated-relation/x-render}}
                template block text
            {{/paginated-relation/x-render}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});

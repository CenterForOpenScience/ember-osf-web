import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | paginated-relation/x-item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{paginated-relation/x-item}}`);

        assert.hasText(this.element, '');

        // Template block usage:
        await render(hbs`
            {{#paginated-relation/x-item}}
                template block text
            {{/paginated-relation/x-item}}
        `);

        assert.hasText(this.element, 'template block text');
    });
});

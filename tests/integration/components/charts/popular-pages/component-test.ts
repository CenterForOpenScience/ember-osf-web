import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | charts/popular-pages', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{charts/popular-pages}}`);

        assert.hasText(this.element, '');

        // Template block usage:
        await render(hbs`
            {{#charts/popular-pages}}
                template block text
            {{/charts/popular-pages}}
        `);

        assert.hasText(this.element, 'template block text');
    });
});

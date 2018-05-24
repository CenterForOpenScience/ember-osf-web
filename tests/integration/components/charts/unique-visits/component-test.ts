import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | charts/unique-visits', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{charts/unique-visits}}`);

        assert.hasText(this.element, '');

        // Template block usage:
        await render(hbs`
            {{#charts/unique-visits}}
                template block text
            {{/charts/unique-visits}}
        `);

        assert.hasText(this.element, 'template block text');
    });
});

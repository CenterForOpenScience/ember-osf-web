import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | charts/top-referrers', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{charts/top-referrers}}`);

        assert.hasText(this.element, '');

        // Template block usage:
        await render(hbs`
            {{#charts/top-referrers}}
                template block text
            {{/charts/top-referrers}}
        `);

        assert.hasText(this.element, 'template block text');
    });
});

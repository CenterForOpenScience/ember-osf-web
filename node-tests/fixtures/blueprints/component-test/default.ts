import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | x-foo', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{x-foo}}`);

        assert.hasText(this.element, '');

        // Template block usage:
        await render(hbs`
            {{#x-foo}}
                template block text
            {{/x-foo}}
        `);

        assert.hasText(this.element, 'template block text');
    });
});

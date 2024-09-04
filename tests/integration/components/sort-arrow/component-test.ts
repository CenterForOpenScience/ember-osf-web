import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | sort-arrow', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{sort-arrow}}`);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
            {{#sort-arrow}}
                template block text
            {{/sort-arrow}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});

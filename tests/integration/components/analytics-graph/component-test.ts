import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | analytics-graph', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{analytics-graph}}`);

        assert.equal(this.element.textContent!.trim(), '');

        // Template block usage:
        await render(hbs`
      {{#analytics-graph}}
            template block text
            {{/analytics-graph}}
            `);

        assert.equal(this.element.textContent!.trim(), 'template block text');
    });
});

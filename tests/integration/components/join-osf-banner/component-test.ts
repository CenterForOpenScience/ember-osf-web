import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | join-osf-banner', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        // Template block usage:
        await render(hbs`
      {{#join-osf-banner}}
      {{/join-osf-banner}}
    `);
        assert.true(true);
    });
});

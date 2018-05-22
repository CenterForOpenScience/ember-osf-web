import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | join-osf-banner', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        // Template block usage:
        await render(hbs`
      {{#join-osf-banner}}
      {{/join-osf-banner}}
    `);
        assert.equal(true, true);
    });
});

import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | search dropdown', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.on('myAction', function(val) { ... });

        await render(hbs`{{search-dropdown}}`);

        // assert.equal(this.$().text().trim(), '');

        // Template block usage:
        await render(hbs`
        {{#search-dropdown}}
          template block text
        {{/search-dropdown}}
      `);

        // assert.equal(this.$().text().trim(), 'template block text');
        // TODO: Implement tests
        assert.ok(true);
    });
});

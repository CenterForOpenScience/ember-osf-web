import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Helper | range', function(hooks) {
    setupRenderingTest(hooks);

    // Replace this with your real tests.
    test('it renders', async function(assert) {
        await render(hbs`
            {{#each (range 1 5) as | i | }}{{i}}{{/each}}
        `);

        assert.equal(this.element.textContent.trim(), '12345');
    });
});

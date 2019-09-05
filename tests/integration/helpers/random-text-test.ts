import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Helper | random-text', hooks => {
    setupRenderingTest(hooks);

    // Replace this with your real tests.
    test('it renders', async function(assert) {
        await render(hbs`{{random-text}}`);

        const randomText = this.element.textContent!.trim();
        assert.ok(randomText);
    });
});

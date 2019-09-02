import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Helper | random-text', hooks => {
    setupRenderingTest(hooks);

    // Replace this with your real tests.
    test('it renders', async function(assert) {
        this.set('inputValue', '1234');

        await render(hbs`{{random-text inputValue}}`);

        assert.equal(this.element.textContent!.trim(), '1234');
    });
});

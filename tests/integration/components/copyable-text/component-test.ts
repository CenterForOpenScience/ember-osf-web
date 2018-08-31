import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | copyable-text', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{copyable-text text='foo'}}`);

        assert.dom('input', this.element).hasValue('foo');
    });
});

import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import 'qunit-dom';

module('Integration | Component | sign-up-policy', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{sign-up-policy}}`);
        assert.dom(this.element).hasText('I have read and agree to the Terms of Use and Privacy Policy.');
    });
});

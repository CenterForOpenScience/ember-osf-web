import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | sign-up-form', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<SignUpForm />`);
        assert.dom(this.element).includesText('I have read and agree to the Terms of Use and Privacy Policy.');
    });
});

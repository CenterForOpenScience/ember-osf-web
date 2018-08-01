import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | sign-up-form', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('submit', () => {
            assert.ok(true);
        });

        await render(hbs`{{sign-up-form submit=submit}}`);
        assert.dom(this.element).includesText('I have read and agree to the Terms of Use and Privacy Policy.');
    });
});

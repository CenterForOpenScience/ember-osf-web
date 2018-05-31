import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | sign-up-policy', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{sign-up-policy}}`);
        assert.hasText(this.element, 'I have read and agree to the Terms of Use and Privacy Policy.');
    });
});

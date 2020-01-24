import { render } from '@ember/test-helpers';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | sign-up-policy', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{sign-up-policy}}`);
        const link1 = 'fakesignup.link';
        const link2 = 'fakesignup.link';
        assert.dom(this.element)
            .hasText(t('osf-components.sign-up-policy.paragraph', { link1, link2, htmlSafe: true }).toString());
    });
});

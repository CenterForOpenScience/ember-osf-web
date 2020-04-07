import { render } from '@ember/test-helpers';
import config from 'ember-get-config';
import { setupIntl, t } from 'ember-intl/test-support';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const { signUpPolicy: { termsLink, privacyPolicyLink } } = config;

module('Integration | Component | sign-up-policy', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks, 'en-us');

    test('it renders', async function(assert) {
        await render(hbs`{{sign-up-policy}}`);
        const link1 = termsLink;
        const link2 = privacyPolicyLink;
        assert.dom(this.element)
            .hasText(
                stripHtmlTags(
                    t('osf-components.sign-up-policy.paragraph', { link1, link2, htmlSafe: true }).toString(),
                ),
            );
    });
});

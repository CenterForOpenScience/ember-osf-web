import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | cookie-banner', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{cookie-banner}}`);

        assert.dom(this.element)
            .hasText('This website relies on cookies to help provide a better user experience. '
                + 'By clicking Accept or continuing to use the site, you agree. '
                + 'For more information, see our Privacy Policy and information on cookie use. Accept');
    });
});

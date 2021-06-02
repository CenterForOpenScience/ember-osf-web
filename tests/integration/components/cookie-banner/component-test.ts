import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | cookie-banner', hooks => {
    setupRenderingTest(hooks);
    const sandbox = sinon.createSandbox();

    hooks.afterEach(() => {
        sandbox.restore();
    });

    test('it renders', async function(assert) {
        sinon.stub(this.owner.lookup('service:cookies'), 'exists').returns(false);
        this.owner.register('service:cookies',
            class CookiesStub extends Service {
                exists() {
                    return false;
                }
            });

        await render(hbs`{{cookie-banner}}`);

        assert.dom(this.element)
            .hasText('This website relies on cookies to help provide a better user experience. '
                + 'By clicking Accept or continuing to use the site, you agree. '
                + 'For more information, see our Privacy Policy and information on cookie use. Accept');
    });
});

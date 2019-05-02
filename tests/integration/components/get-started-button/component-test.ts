import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-i18n/test-support';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | Get Started button', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        await render(hbs`<GetStartedButton />`);
        assert.dom('[data-test-get-started-button]').exists();
        assert.dom('[data-test-get-started-button]').containsText(t('home.free_link').toString());
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});

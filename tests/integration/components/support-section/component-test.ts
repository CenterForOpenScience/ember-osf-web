import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';

import { module, test } from 'qunit';

module('Integration | Component | support-section', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<Home::-Components::SupportSection />`);

        assert.dom('[data-test-support-heading]')
            .containsText(t('new-home.support-section.header').toString());
        assert.dom('[data-test-support-search]').exists();
        assert.dom('[data-test-support-design]').exists();
        assert.dom('[data-test-support-analyze]').exists();
        assert.dom('[data-test-support-publish]').exists();
        assert.dom('[data-test-arrow]').exists({ count: 3 });

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});

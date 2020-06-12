import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | learn-more-button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<Home::-Components::SupportSection::LearnMoreButton />`);
        assert.dom('[data-test-learn-more-button]').exists();
        assert.dom('[data-test-learn-more-button]').hasText('Learn more');

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});

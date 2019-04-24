import { render } from '@ember/test-helpers';
// TODO: Add a11y tests after added to develop
// import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | learn-more-button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`<LearnMoreButton />`);
        assert.dom('[data-test-learn-more-button]').exists();
        assert.dom('[data-test-learn-more-button]').hasText('Learn more');
        // TODO: Add a11y tests to page after adding to develop
        // await a11yAudit(this.element);
        // assert.ok(true, 'No a11y errors on page');
    });
});

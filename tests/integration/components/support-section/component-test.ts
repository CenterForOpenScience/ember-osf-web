import { render } from '@ember/test-helpers';
// TODO: Add a11y tests after added to develop
// import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | support-section', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`<SupportSection />`);
        assert.dom('[data-test-support-heading]').hasText('How OSF supports your research');
        assert.dom('[data-test-support-search]').exists();
        assert.dom('[data-test-support-design]').exists();
        assert.dom('[data-test-support-analyze]').exists();
        assert.dom('[data-test-support-publish]').exists();
        assert.dom('[data-test-arrow]').exists({ count: 3 });
        // TODO: Add a11y tests to page after adding to develop
        // await a11yAudit(this.element);
        // assert.ok(true, 'No a11y errors on page');
    });
});

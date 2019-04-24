import { render } from '@ember/test-helpers';
// TODO: Add a11y tests after added to develop
// import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | support-item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('icon', 'search');
        this.set('header', 'Test header');
        this.set('subHeader', 'Test subheader');
        await render(hbs`
            <SupportItem
                @icon={{this.icon}}
                @header={{this.header}}
                @subHeader={{this.subHeader}}
            />`);
        assert.dom('[data-test-icon-image]').exists();
        assert.dom('[data-test-icon-image]').hasAttribute('alt', 'search');
        assert.dom('[data-test-support-header]').hasText('Test header');
        assert.dom('[data-test-support-subheader]').hasText('Test subheader');
        // TODO: Add a11y tests to page after adding to develop
        // await a11yAudit(this.element);
        // assert.ok(true, 'No a11y errors on page');
    });
});

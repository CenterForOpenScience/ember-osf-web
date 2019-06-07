import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { t } from 'ember-i18n/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | support-item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('icon', 'search');
        this.set('header', 'Search and Discover');
        this.set('description', 'Find papers, data, and materials to inspire your next research project. ' +
        'Search public projects to build on the work of others and find new collaborators.');

        await render(hbs`
            <NewHome::-Components::SupportSection::SupportItem
                @icon={{this.icon}}
                @header={{this.header}}
                @description={{this.description}}
            />`);
        assert.dom('[data-test-icon-image]').exists();
        assert.dom('[data-test-icon-image]').hasAttribute('alt', 'search');
        assert.dom('[data-test-support-header]')
            .containsText(t('new-home.support-section.search.header').toString());
        assert.dom('[data-test-support-description]')
            .containsText(t('new-home.support-section.search.description').toString());

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});

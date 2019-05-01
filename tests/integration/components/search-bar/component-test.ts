import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | search-bar', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        this.set('search', {});
        await render(hbs`<SearchBar @onSearch={{this.search}} />`);
        assert.dom('[data-test-search-bar]').exists();
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});

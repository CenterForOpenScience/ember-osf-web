import { fillIn, render, settled, triggerKeyEvent } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | discover-research', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        this.set('search', {});
        await render(hbs`<DiscoverResearch @onSearch={{this.search}} />`);
        assert.dom('[data-test-discover-heading]').hasText('Discover public research');
        assert.dom('[data-test-discover-subheading]')
            .hasText('Discover projects, data, materials, and collaborators on OSF that might be helpful ' +
            'to your own research.');
        assert.dom('[data-test-search-bar]').exists();
    });

    test('search bar works', async function(assert) {
        assert.expect(1);

        this.set('search', () => { assert.ok(true); });
        await render(hbs`<DiscoverResearch @onSearch={{action this.search}} />`);

        await fillIn('[data-test-discover-input]', 'search string');
        settled().then(() => {
            triggerKeyEvent('[data-test-discover-input]', 'keyup', 'Enter');
        });
    });
});

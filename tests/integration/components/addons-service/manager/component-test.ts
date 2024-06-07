import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | addons-service | manager', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    test('it loads and filters', async function(assert) {
        server.loadFixtures('external-storage-services');
        server.loadFixtures('external-citation-services');
        server.loadFixtures('external-computing-services');
        this.owner.register('service:current-user', CurrentUserStub);
        const store = this.owner.lookup('service:store');
        const mirageNode = server.create('node', { id: 'test' });
        const user = server.create('user', { id: 'user' });
        this.owner.lookup('service:current-user').setProperties({ testUser: user, currentUserId: user.id });
        const node = await store.findRecord('node', mirageNode.id);
        server.create('resource-reference',
            { id: mirageNode.id, configuredStorageAddons: [] });
        server.create('user-reference', { id: user.id });
        this.set('node', node);
        await render(hbs`
<AddonsService::Manager
    @node={{this.node}}
    as |manager|
>
    {{#if manager.currentListIsLoading}}
        <span data-test-loading>Loading...</span>
    {{else}}
        <Input @type='text' @value={{manager.filterText}} />
        {{#each manager.possibleFilterTypes as |type|}}
            <button
                data-test-filter={{type}}
                type='button'
                {{on 'click' (fn manager.filterByAddonType type)}}
            >
                {{t (concat 'addons.list.filter.' type)}}
            </button>
        {{/each}}

        {{#each manager.filteredAddonProviders as |provider index|}}
            <span data-test-provider={{provider.provider.displayName}}>{{provider.provider.displayName}}</span>
        {{/each}}
    {{/if}}
</AddonsService::Manager>
        `);

        // Default view: storage providers
        assert.dom('[data-test-loading]').doesNotExist('Done loading');
        assert.dom('[data-test-provider]').exists({ count: 9 }, 'Has providers');
        assert.dom('[data-test-provider="Box"]').hasText('Box', 'Has loaded Box');
        assert.dom('[data-test-provider="Zotero"]').doesNotExist('No citation service shown');
        assert.dom('[data-test-provider="Boa"]').doesNotExist('No cloud computing service shown');
        await fillIn('input', 'OneDrive');
        assert.dom('[data-test-provider]').exists({ count: 1 }, 'Has filtered providers');
        assert.dom('[data-test-provider]').hasText('OneDrive', 'Filtered down to just OneDrive');
        await fillIn('input', '');
        assert.dom('[data-test-provider]').exists({ count: 9 }, 'Filter removed');

        // Filter by citation manager
        await click('[data-test-filter=citation-manager]');
        assert.dom('[data-test-provider]').exists({ count: 2 }, 'Has citation providers');
        assert.dom('[data-test-provider]').hasText('Mendeley', 'Has loaded Mendeley');
        await fillIn('input', 'Bolero');
        assert.dom('[data-test-provider]').doesNotExist('No Bolero');
        await fillIn('input', 'Zot');
        assert.dom('[data-test-provider]').exists({ count: 1 }, 'Has filtered providers');
        assert.dom('[data-test-provider]').hasText('Zotero', 'Filtered down to just Zotero');

        // Filter by cloud computing
        await click('[data-test-filter=cloud-computing]');
        assert.dom('[data-test-provider]').exists({ count: 1 }, 'Has cloud providers');
        assert.dom('[data-test-provider]').hasText('Boa', 'Has loaded Boa');
    });
});

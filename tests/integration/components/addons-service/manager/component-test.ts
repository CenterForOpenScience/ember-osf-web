import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';

module('Integration | Component | addons-service | manager', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    // TODO: Add test for filtering
    test('it loads', async function(assert) {
        server.loadFixtures('external-storage-services');
        this.owner.register('service:current-user', CurrentUserStub);
        const store = this.owner.lookup('service:store');
        const mirageNode = server.create('node', { id: 'test' });
        const user = server.create('user', { id: 'user' });
        this.owner.lookup('service:current-user').setProperties({ testUser: user, currentUserId: user.id });
        const node = await store.findRecord('node', mirageNode.id);
        server.create('internal-resource',
            { id: mirageNode.id, configuredStorageAddons: [] });
        server.create('internal-user', { id: user.id });
        this.set('node', node);
        await render(hbs`
<AddonsService::Manager
    @node={{this.node}}
    as |manager|
>
    {{#if manager.currentListIsLoading}}
        <span data-test-loading>Loading...</span>
    {{else}}
        {{#each manager.filteredAddonProviders as |provider index|}}
            <span data-test-provider>{{provider.provider.name}}</span>
        {{/each}}
    {{/if}}
</AddonsService::Manager>
        `);
        assert.dom('[data-test-loading]').doesNotExist('Done loading');
        assert.dom('[data-test-provider]').exists({ count: 1 }, 'Has providers');
        assert.dom('[data-test-provider]').hasText('Box', 'Has loaded Box');
    });
});

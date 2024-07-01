import { click, fillIn, render } from '@ember/test-helpers';
import { TestContext } from 'ember-test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';
import { setupIntl } from 'ember-intl/test-support';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import { ModelInstance } from 'ember-cli-mirage';

interface AddonManagerTestContext extends TestContext {
    user: any;
    userRef: any;
}

module('Integration | Component | addons-service | user-addons-manager', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function(this: AddonManagerTestContext) {
        server.loadFixtures('external-storage-services');
        server.loadFixtures('external-citation-services');
        server.loadFixtures('external-computing-services');
        this.owner.register('service:current-user', CurrentUserStub);
        const store = this.owner.lookup('service:store');
        const mirageUser = server.create('user', { id: 'user' });
        const user = await store.findRecord('user', mirageUser.id);
        this.owner.lookup('service:current-user').setProperties({ testUser: user, currentUserId: user.id });
        const userRef = server.create('user-reference', { id: user.id });
        this.set('user', user);
        this.set('userRef', userRef);
    });

    test('it loads and filters providers and accounts', async function(this: AddonManagerTestContext, assert) {
        const box = server.schema.externalStorageServices.find('box') as ModelInstance<ExternalStorageServiceModel>;
        server.create('authorized-storage-account', {
            displayName: 'My box account',
            accountOwner: this.userRef,
            externalStorageService: box,
        });
        await render(hbs`
<AddonsService::UserAddonsManager
    @user={{this.user}}
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

        {{#each manager.filteredAddonProviders as |provider|}}
            <button
                type='button'
                {{on 'click' (fn manager.connectNewProviderAccount provider)}}
                data-test-provider={{provider.provider.displayName}}
            >
                {{provider.provider.displayName}}
            </button>
        {{/each}}

        {{#each manager.currentTypeAuthorizedAccounts as |account|}}
            <span data-test-account={{account.externalStorageService.displayName}}>{{account.displayName}}</span>
        {{/each}}
    {{/if}}
</AddonsService::UserAddonsManager>
        `);

        // Default view: storage providers
        assert.dom('[data-test-loading]').doesNotExist('Done loading');
        assert.dom('[data-test-selected-provider]').doesNotExist('No provider selected');
        assert.dom('[data-test-provider]').exists({ count: 9 }, 'Has storage providers');
        assert.dom('[data-test-provider="Box"]').hasText('Box', 'Has loaded Box');
        assert.dom('[data-test-account]').exists({ count: 1 }, 'Has authorized account');
        assert.dom('[data-test-account="Box"]').hasText('My box account', 'Has loaded Box account');
        assert.dom('[data-test-provider="Zotero"]').doesNotExist('No citation service shown');
        assert.dom('[data-test-provider="Boa"]').doesNotExist('No cloud computing service shown');
        // Filter to OneDrive
        await fillIn('input', 'OneDrive');
        assert.dom('[data-test-provider]').exists({ count: 1 }, 'Has filtered providers');
        assert.dom('[data-test-account]').doesNotExist('Box authorized account is no longer shown');
        assert.dom('[data-test-provider]').hasText('OneDrive', 'Filtered down to just OneDrive');
        // Clear filter
        await fillIn('input', '');
        assert.dom('[data-test-provider]').exists({ count: 9 }, 'Filter removed');

        // Filter by citation manager
        await click('[data-test-filter=citation-manager]');
        assert.dom('[data-test-provider]').exists({ count: 2 }, 'Has citation providers');
        assert.dom('[data-test-provider]').hasText('Mendeley', 'Has loaded Mendeley');
        assert.dom('[data-test-account]').doesNotExist('No authorized accounts shown');
        // Filter to non-existent provider
        await fillIn('input', 'Bolero');
        assert.dom('[data-test-provider]').doesNotExist('No Bolero');
        // Filter to Zotero
        await fillIn('input', 'Zot');
        assert.dom('[data-test-provider]').exists({ count: 1 }, 'Has filtered providers');
        assert.dom('[data-test-provider]').hasText('Zotero', 'Filtered down to just Zotero');

        // Filter by cloud computing
        await click('[data-test-filter=cloud-computing]');
        assert.dom('[data-test-provider]').exists({ count: 1 }, 'Has cloud providers');
        assert.dom('[data-test-provider]').hasText('Boa', 'Has loaded Boa');
    });

    test('it traverses page modes for new account creation', async function(this: AddonManagerTestContext, assert) {
        await render(hbs`
<AddonsService::UserAddonsManager
    @user={{this.user}}
    as |manager|
>
    {{#if manager.currentListIsLoading}}
        <span data-test-loading>Loading...</span>
    {{else}}
        {{#if manager.selectedProvider}}
            <span data-test-selected-provider>{{manager.selectedProvider.displayName}}</span>
            <button
                data-test-cancel-setup
                type='button'
                {{on 'click' manager.cancelSetup}}
            >
                Cancel
            </button>
            {{#if (eq manager.pageMode 'terms')}}
                <button
                    type='button'
                    {{on 'click' manager.acceptProviderTerms}}
                    data-test-accept-terms
                >
                    Accept
                </button>
            {{else if (eq manager.pageMode 'accountCreate')}}
                <span data-test-create-account>
                    Connect
                </span>
            {{/if}}
        {{else}}
            <Input @type='text' @value={{manager.filterText}} />
            {{#each manager.filteredAddonProviders as |provider|}}
                <button
                    type='button'
                    {{on 'click' (fn manager.connectNewProviderAccount provider)}}
                    data-test-provider={{provider.provider.displayName}}
                >
                    {{provider.provider.displayName}}
                </button>
            {{/each}}
        {{/if}}
    {{/if}}
</AddonsService::UserAddonsManager>
        `);

        // Select a provider
        await click('[data-test-provider=OneDrive]');
        assert.dom('[data-test-provider]').doesNotExist('No providers shown after selecting a provider');
        assert.dom('[data-test-selected-provider]').hasText('OneDrive', 'Selected OneDrive');

        // Accept terms
        assert.dom('[data-test-accept-terms]').exists(
            'Page mode changes to Terms after manager.connectNewProviderAccount is called',
        );
        await click('[data-test-accept-terms]');

        // Connect account
        assert.dom('[data-test-create-account]').exists(
            'Page mode changes to AccountCreate after manager.acceptProviderTerms is called',
        );

        // Cancel setup
        await click('[data-test-cancel-setup]');
        assert.dom('[data-test-selected-provider]').doesNotExist('No providers shown after cancelling setup');
        assert.dom('[data-test-provider]').exists({ count: 9 }, 'Shows providers again');
    });

    test('it reauthorizes and removes authorized accounts', async function(this: AddonManagerTestContext, assert) {
        const box = server.schema.externalStorageServices.find('box') as ModelInstance<ExternalStorageServiceModel>;
        server.create('authorized-storage-account', {
            displayName: 'My box account',
            accountOwner: this.userRef,
            externalStorageService: box,
        });
        await render(hbs`
<AddonsService::UserAddonsManager
    @user={{this.user}}
    as |manager|
>
    {{#if manager.currentListIsLoading}}
        <span data-test-loading>Loading...</span>
    {{else}}
        {{#if manager.selectedProvider}}
            <span data-test-selected-provider>{{manager.selectedProvider.displayName}}</span>
            <span data-test-selected-account>{{manager.selectedAccount.displayName}}</span>
            {{#if (eq manager.pageMode 'accountReconnect')}}
                <span data-test-reconnect-placeholder>Reconnect workflow here</span>
                <button
                    type='button'
                    {{on 'click' manager.cancelSetup}}
                    data-test-cancel-reconnect
                >
                    Cancel
                </button>
            {{/if}}
        {{else}}
            {{#each manager.currentTypeAuthorizedAccounts as |account|}}
                <button
                    type='button'
                    data-test-account={{account.displayName}}
                    {{on 'click' (fn manager.navigateToReconnectProviderAccount account)}}
                >
                    {{account.displayName}}
                </button>
                <button
                    type='button'
                    data-test-remove-account={{account.displayName}}
                    {{on 'click' (perform manager.disconnectAccount account)}}
                >
                    Remove
                </button>
            {{/each}}
        {{/if}}
    {{/if}}
</AddonsService::UserAddonsManager>
        `);

        // Select an account
        await click('[data-test-account="My box account"]');
        assert.dom('[data-test-selected-provider]').hasText('Box',
            'Manager has selected Box as provider associated with authorized account');
        assert.dom('[data-test-selected-account]').hasText('My box account',
            'Manager has selected My box account as authorized account');
        assert.dom('[data-test-reconnect-placeholder]').exists('Manager is in accountReconnect page mode');
        await click('[data-test-cancel-reconnect]');

        // Remove account
        await click('[data-test-remove-account="My box account"]');
        assert.dom('[data-test-account="My box account"]').doesNotExist(
            'Manager has removed My box account from authorized accounts',
        );
    });
});

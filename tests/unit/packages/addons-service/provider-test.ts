import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Provider from 'ember-osf-web/packages/addons-service/provider';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';
import { taskFor } from 'ember-concurrency-ts';

module('Unit | Packages | addons-service | provider', function(hooks) {
    setupTest(hooks);
    setupMirage(hooks);

    test('It works', async function(assert) {
        const store = this.owner.lookup('service:store');
        this.owner.register('service:current-user', CurrentUserStub);
        const currentUser = this.owner.lookup('service:current-user');

        const mirageUser = server.create('user', 'loggedIn');
        const user = await store.findRecord('user', mirageUser.id);
        currentUser.setProperties({ testUser: user, currentUserId: user.id });

        const node = store.createRecord('node', {
            id: 'wowza',
            currentUserPermissions: [ 'read', 'write', 'admin' ],
        });
        // Make the addons service stuff
        const externalStorageService = server.create('external-storage-service', {
            id: 'bropdox',
            name: 'Bropdox',
        });
        const internalResource = server.create('internal-resource', {
            id: node.id,
        });
        const internalUser = server.create('internal-user', {
            id: user.id,
            configuredResources: [internalResource],
            authorizedStorageAccounts: [],
        });

        server.create('configured-storage-addon', {
            externalUserId: user.id,
            externalUserDisplayName: user.fullName,
            rootFolder: '/rooty-tooty/',
            storageProvider: externalStorageService,
            accountOwner: internalUser,
            authorizedResource: internalResource,
        });

        const provider = new Provider(externalStorageService, currentUser, node);

        assert.notOk(provider.internalUser, 'Provider internalUser is not set before initialize');
        assert.notOk(provider.serviceNode, 'Provider serviceNode is not set before initialize');
        assert.notOk(provider.configuredStorageAddon, 'Provider configuredStorageAddon is not set before initialize');

        await taskFor(provider.initialize).perform();

        assert.equal(provider.internalUser.id, currentUser.user.id, 'Provider internalUser is set after initialize');
        assert.equal(provider.serviceNode?.id, node.id, 'Provider serviceNode is set after initialize');
        assert.ok(provider.configuredStorageAddon,
            'Provider configuredStorageAddon is set after initialize');
    });

    test('sets rootFolder and disables addon', async function(assert) {
        const store = this.owner.lookup('service:store');
        this.owner.register('service:current-user', CurrentUserStub);
        const currentUser = this.owner.lookup('service:current-user');

        const mirageUser = server.create('user', 'loggedIn');
        const user = await store.findRecord('user', mirageUser.id);
        currentUser.setProperties({ testUser: user, currentUserId: user.id });

        const node = store.createRecord('node', {
            id: 'wowza',
            currentUserPermissions: [ 'read', 'write', 'admin' ],
        });
        // Make the addons service stuff
        const externalStorageService = server.create('external-storage-service', {
            id: 'bropdox',
            name: 'Bropdox',
        });
        const internalResource = server.create('internal-resource', {
            id: node.id,
        });
        const internalUser = server.create('internal-user', {
            id: user.id,
            configuredResources: [internalResource],
            authorizedStorageAccounts: [],
        });

        server.create('configured-storage-addon', {
            externalUserId: user.id,
            externalUserDisplayName: user.fullName,
            rootFolder: '/',
            storageProvider: externalStorageService,
            accountOwner: internalUser,
            authorizedResource: internalResource,
        });

        const provider = new Provider(externalStorageService, currentUser, node);
        await taskFor(provider.initialize).perform();

        const account = await taskFor(provider.createAccountForNodeAddon).perform();
        assert.notOk(provider.configuredStorageAddon?.baseAccount, 'Base account is not set');
        await taskFor(provider.setNodeAddonCredentials).perform(account);
        assert.equal(provider.configuredStorageAddon?.baseAccount?.id, account.id, 'Base account is set');
        assert.equal(provider.configuredStorageAddon?.rootFolder, '/', 'Root folder is default');
        await taskFor(provider.setRootFolder).perform('/groot/');
        assert.equal(provider.configuredStorageAddon?.rootFolder, '/groot/', 'Root folder is set');

        await taskFor(provider.disableProjectAddon).perform();
        assert.equal(provider.configuredStorageAddon, undefined, 'Project addon is disabled');
    });
});

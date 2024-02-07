import { settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { taskFor } from 'ember-concurrency-ts';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import Provider from 'ember-osf-web/packages/addons-service/provider';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';

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
        const resourceReference = server.create('resource-reference', {
            id: node.id,
        });
        const userReference = server.create('user-reference', {
            id: user.id,
            configuredResources: [resourceReference],
            authorizedStorageAccounts: [],
        });

        server.create('configured-storage-addon', {
            externalUserId: user.id,
            externalUserDisplayName: user.fullName,
            rootFolder: '/rooty-tooty/',
            storageProvider: externalStorageService,
            accountOwner: userReference,
            authorizedResource: resourceReference,
        });

        const provider = new Provider(externalStorageService, currentUser, node);
        await settled();

        assert.equal(provider.userReference.id, currentUser.user.id, 'Provider userReference is set after initialize');
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
        const resourceReference = server.create('resource-reference', {
            id: node.id,
        });
        const userReference = server.create('user-reference', {
            id: user.id,
            configuredResources: [resourceReference],
            authorizedStorageAccounts: [],
        });

        server.create('configured-storage-addon', {
            externalUserId: user.id,
            externalUserDisplayName: user.fullName,
            rootFolder: '/',
            storageProvider: externalStorageService,
            accountOwner: userReference,
            authorizedResource: resourceReference,
        });

        const provider = new Provider(externalStorageService, currentUser, node);
        await settled();

        const account = await taskFor(provider.createAccountForNodeAddon).perform();
        await taskFor(provider.setNodeAddonCredentials).perform(account);
        assert.equal(provider.configuredStorageAddon?.baseAccount?.get('id'), account.id, 'Base account is set');
        assert.equal(provider.configuredStorageAddon?.rootFolder, '/', 'Root folder is default');

        await taskFor(provider.setRootFolder).perform('/groot/');
        assert.equal(provider.configuredStorageAddon?.rootFolder, '/groot/', 'Root folder is set');

        await taskFor(provider.disableProjectAddon).perform();
        assert.notOk(provider.configuredStorageAddon, 'Project addon is disabled');
    });
});

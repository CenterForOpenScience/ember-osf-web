import { settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { taskFor } from 'ember-concurrency-ts';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import Provider from 'ember-osf-web/packages/addons-service/provider';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';
import { Permission } from 'ember-osf-web/models/osf-model';

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

        const mirageNode = server.create('node', {
            id: 'wowza',
            currentUserPermissions: [ Permission.Read, Permission.Write, Permission.Admin ],
        });
        const node = await store.findRecord('node', mirageNode.id);
        // Make the addons service stuff
        const mirageExternalStorageService = server.create('external-storage-service', {
            id: 'bropdox',
            displayName: 'Bropdox',
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
            displayName: 'bropdox',
            externalUserId: user.id,
            externalUserDisplayName: user.fullName,
            rootFolder: '/rooty-tooty/',
            externalStorageService: mirageExternalStorageService,
            accountOwner: userReference,
            authorizedResource: resourceReference,
        });
        const externalStorageService = await this.owner.lookup('service:store')
            .findRecord('external-storage-service', mirageExternalStorageService.id);

        const provider = new Provider(externalStorageService, currentUser, node);
        await settled();

        assert.equal(provider.userReference.id, currentUser.user.id, 'Provider userReference is set after initialize');
        assert.equal(provider.serviceNode?.id, node.id, 'Provider serviceNode is set after initialize');
        // TODO: Fix this with [ENG-5454]
        // assert.ok(provider.configuredAddon,
        //     'Provider configuredAddon is set after initialize');
    });

    test('sets rootFolder and disables addon', async function(assert) {
        const store = this.owner.lookup('service:store');
        this.owner.register('service:current-user', CurrentUserStub);
        const currentUser = this.owner.lookup('service:current-user');

        const mirageUser = server.create('user', 'loggedIn');
        const user = await store.findRecord('user', mirageUser.id);
        currentUser.setProperties({ testUser: user, currentUserId: user.id });

        const mirageNode = server.create('node', {
            id: 'wowza',
            currentUserPermissions: [ Permission.Read, Permission.Write, Permission.Admin ],
        });
        const node = await store.findRecord('node', mirageNode.id);
        // Make the addons service stuff
        const mirageExternalStorageService = server.create('external-storage-service', {
            id: 'bropdox',
            displayName: 'Bropdox',
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
            displayName: 'bropdox',
            externalUserId: user.id,
            externalUserDisplayName: user.fullName,
            rootFolder: '/',
            externalStorageService: mirageExternalStorageService,
            accountOwner: userReference,
            authorizedResource: resourceReference,
        });
        const externalStorageService = await this.owner.lookup('service:store')
            .findRecord('external-storage-service', mirageExternalStorageService.id);

        const provider = new Provider(externalStorageService, currentUser, node);
        await settled();

        await taskFor(provider.createAuthorizedAccount)
            .perform({}, 'bropdox account');

        // TODO: Fix these with [ENG-5454]
        // assert.equal((provider.configuredAddon as ConfiguredStorageAddonModel)
        //     .baseAccount?.get('id'), account.id, 'Base account is set');
        // assert.equal((provider.configuredAddon as ConfiguredStorageAddonModel)
        //     .rootFolder, '/', 'Root folder is default');

        // await taskFor(provider.setRootFolder).perform('/groot/');
        // assert.equal((provider.configuredAddon as ConfiguredStorageAddonModel)
        //     .rootFolder, '/groot/', 'Root folder is set');

        await taskFor(provider.disableProjectAddon).perform();
        assert.notOk(provider.configuredAddon, 'Project addon is disabled');
    });
});

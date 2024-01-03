import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import AddonModel from 'ember-osf-web/models/addon';
import { Permission } from 'ember-osf-web/models/osf-model';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';
import LegacyProvider from 'ember-osf-web/packages/addons-service/legacy-provider';
import NodeModel from 'ember-osf-web/models/node';
import { taskFor } from 'ember-concurrency-ts';


module('Unit | Packages | addons-service | legacy-provider', hooks => {
    setupTest(hooks);
    setupMirage(hooks);
    test('It works', async function(assert) {
        this.owner.register('service:current-user', CurrentUserStub);
        const currentUser = this.owner.lookup('service:current-user');

        const mirageUser = server.create('user', 'loggedIn');
        const user = await this.owner.lookup('service:store').findRecord('user', mirageUser.id);
        currentUser.setProperties({ testUser: user, currentUserId: user.id });

        const filesNode = server.create('node', {
            id: 'file5',
            title: 'Without files',
            boaEnabled: true,
            currentUserPermissions: [Permission.Read, Permission.Write, Permission.Admin],
        });
        const node = await this.owner.lookup('service:store').findRecord('node', filesNode.id);

        const dropbox = server.create('addon', {name: 'dropbox', id: 'dropbox'}) as ModelInstance<AddonModel>;
        const dropboxAccount = server.create('external-account', {
            displayName: 'Bugs Bunny',
            provider: dropbox,
        });
        const dropboxAccountTwo = server.create('external-account', {
            displayName: 'Daffy Duck',
            provider: dropbox,
        });
        server.create('user-addon', {
            id: 'dropbox',
            externalAccounts: [ dropboxAccount, dropboxAccountTwo ],
            userHasAuth: true,
            user: mirageUser,
            addon: dropbox,
        });

        const provider = new LegacyProvider(
            dropbox as unknown as AddonModel,
            currentUser,
            node as unknown as NodeModel,
        );
        const userAddonAccounts = await taskFor(provider.userAddonAccounts).perform();
        assert.equal(userAddonAccounts[0].displayName, 'Bugs Bunny');
        assert.equal(userAddonAccounts[1].displayName, 'Daffy Duck');

        await taskFor(provider.createAccountForNodeAddon).perform();
        await taskFor(provider.setNodeAddonCredentials).perform(userAddonAccounts[0]);
        await taskFor(provider.setRootFolder).perform('/root/');

        assert.equal(provider.nodeAddon!.folderPath, '/root/');
        assert.equal((await provider.nodeAddon!.externalAccount).get('displayName'), 'Bugs Bunny');

        await taskFor(provider.disableProjectAddon).perform();
        assert.equal(provider.nodeAddon, undefined);
    });

    test('It caches the node addon', async function(assert) {
        this.owner.register('service:current-user', CurrentUserStub);
        const currentUser = this.owner.lookup('service:current-user');

        const mirageUser = server.create('user', 'loggedIn');
        const user = await this.owner.lookup('service:store').findRecord('user', mirageUser.id);
        currentUser.setProperties({ testUser: user, currentUserId: user.id });

        const filesNode = server.create('node', {
            id: 'file5',
            title: 'Without files',
            boaEnabled: true,
            currentUserPermissions: [Permission.Read, Permission.Write, Permission.Admin],
        });
        const node = await this.owner.lookup('service:store').findRecord('node', filesNode.id);

        const dropbox = server.create('addon', {name: 'dropbox', id: 'dropbox'}) as ModelInstance<AddonModel>;
        const dropboxAccount = server.create('external-account', {
            displayName: 'Bugs Bunny',
            provider: dropbox,
        });
        const dropboxAccountTwo = server.create('external-account', {
            displayName: 'Daffy Duck',
            provider: dropbox,
        });
        server.create('user-addon', {
            id: 'dropbox',
            externalAccounts: [ dropboxAccount, dropboxAccountTwo ],
            userHasAuth: true,
            user: mirageUser,
            addon: dropbox,
        });
        server.create('node-addon', {
            id: 'dropbox',
            externalAccount: dropboxAccount,
            node: filesNode,
        });

        const provider = new LegacyProvider(
            dropbox as unknown as AddonModel,
            currentUser,
            node as unknown as NodeModel,
        );

        assert.equal(provider.nodeAddon, undefined);
        await taskFor(provider.setRootFolder).perform('/root/');
        assert.equal(provider.nodeAddon!.folderPath, '/root/');
    });
});


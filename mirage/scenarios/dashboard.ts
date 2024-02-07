import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import FileProviderModel from 'ember-osf-web/models/file-provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import User from 'ember-osf-web/models/user';

const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

export function dashboardScenario(server: Server, currentUser: ModelInstance<User>) {
    server.create('user-setting', { user: currentUser });
    const firstNode = server.create('node', 'withAffiliatedInstitutions');
    server.create('contributor', { node: firstNode, users: currentUser, index: 0 });
    const component = server.create('node', {id: 'cmpnt', parent: firstNode}, 'withFiles', 'withStorage');
    server.create('contributor', { node: component, users: currentUser, index: 0, permission: Permission.Admin });
    const nodes = server.createList('node', 10, {
        currentUserPermissions: Object.values(Permission),
    }, 'withContributors');
    for (const node of nodes) {
        server.create('contributor', {
            node,
            users: currentUser,
            permission: Permission.Admin,
            index: 0,
        });
    }

    server.create('node', {
        id: noteworthyNode,
        linkedNodes: nodes.slice(0, 5),
        title: 'NNW',
        currentUserPermissions: [Permission.Read],
    });
    server.create('node', {
        id: popularNode,
        linkedNodes: nodes.slice(5, 10),
        title: 'Popular',
        currentUserPermissions: [Permission.Read],
    });
    for (const node of nodes.slice(4, 10)) {
        server.create('contributor', { node, users: currentUser, index: 11 });
    }

    const filesNode = server.create('node', {
        id: 'file5',
        title: 'With some files',
        boaEnabled: true,
        currentUserPermissions: [Permission.Read, Permission.Write, Permission.Admin],
    }, 'withFiles', 'withStorage', 'withContributors', 'withAffiliatedInstitutions', 'withDoi', 'withLinkedByNodes');
    const filesNodeOsfStorage = filesNode.files.models.filter(
        (provider: ModelInstance<FileProviderModel>) => provider.name === 'osfstorage',
    )[0] as ModelInstance<FileProviderModel>;
    server.create('file', {
        id: 'snake',
        name: 'snake.boa',
        checkout: currentUser.id,
        target: filesNode,
        parentFolder: filesNodeOsfStorage.rootFolder,
    });
    server.create('contributor', {
        node: filesNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });

    // Box using Addons Service
    const boxAddon = server.schema.externalStorageServices
        .find('box') as ModelInstance<ExternalStorageServiceModel>;
    const dropboxAddon = server.schema.externalStorageServices
        .find('dropbox') as ModelInstance<ExternalStorageServiceModel>;
    const addonUser = server.create('user-reference', { id: currentUser.id });
    const addonFile5 = server.create('resource-reference', { id: filesNode.id });
    addonUser.update({
        configuredResources: [addonFile5],
    });

    const boxAccount = server.create('authorized-storage-account', {
        externalUserId: currentUser.id,
        externalUserDisplayName: currentUser.fullName,
        scopes: ['write'], // TODO: This should be a from an enum?
        storageProvider: boxAddon,
        configuringUser: addonUser,
    });

    server.create('authorized-storage-account', {
        externalUserId: currentUser.id,
        externalUserDisplayName: currentUser.fullName,
        scopes: ['write'], // TODO: This should be a from an enum?
        storageProvider: dropboxAddon,
        configuringUser: addonUser,
    });

    server.create('configured-storage-addon', {
        rootFolder: '/woot/',
        storageProvider: boxAddon,
        accountOwner: addonUser,
        authorizedResource: addonFile5,
        baseAccount: boxAccount,
    });

    // NOTE: Some institutions are already created by this point
    server.createList('institution', 20);
    // Create a specific institution to test institutional dashboard with; should be ID 29 at this point
    server.create('institution', {
        id: 'has-users',
    }, 'withMetrics');
}

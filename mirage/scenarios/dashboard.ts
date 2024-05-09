import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import { MirageNode } from 'ember-osf-web/mirage/factories/node';

import FileProviderModel from 'ember-osf-web/models/file-provider';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import User from 'ember-osf-web/models/user';
import { ConnectedOperationNames, ConnectedCapabilities } from 'ember-osf-web/models/configured-storage-addon';

const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
    assetsPrefix,
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

    server.create('file-provider', {
        id: 'box1',
        name: 'Box',
        provider: 'box',
        target: filesNode,
    });
    // const boxFiles = server.createList('file', 3, { target: filesNode });
    // filesNodeBoxStorage.rootFolder.update({ boxFiles });

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
    const s3Addon = server.schema.externalStorageServices
        .find('s3') as ModelInstance<ExternalStorageServiceModel>;
    const addonUser = server.create('user-reference', { id: currentUser.id });
    const addonFile5 = server.create('resource-reference', { id: filesNode.id });
    addonUser.update({
        configuredResources: [addonFile5],
    });

    const boxAccount = server.create('authorized-storage-account', {
        displayName: 'My Box Account',
        scopes: ['write'], // TODO: This should be a from an enum?
        storageProvider: boxAddon,
        configuringUser: addonUser,
        credentialsAvailable: true,
    });

    server.create('authorized-storage-account', {
        displayName: 'My Dropbox Account',
        scopes: ['write'], // TODO: This should be a from an enum?
        storageProvider: dropboxAddon,
        configuringUser: addonUser,
        credentialsAvailable: true,
    });
    server.create('authorized-storage-account', {
        id: 'dropbox2',
        displayName: 'My Secret Dropbox Account',
        scopes: ['write'], // TODO: This should be a from an enum?
        storageProvider: dropboxAddon,
        configuringUser: addonUser,
        credentialsAvailable: false,
        authUrl: 'http://fake.com',
    });
    server.create('authorized-storage-account', {
        displayName: 'My AmazonS3 Account',
        scopes: ['write'], // TODO: This should be a from an enum?
        storageProvider: s3Addon,
        configuringUser: addonUser,
        credentialsAvailable: false,
    });

    server.create('configured-storage-addon', {
        id: 'box1',
        name: 'Box',
        displayName: 'Boxed Data',
        rootFolder: '/woot/',
        authorizedResourceUri: 'http://localhost:5000/file5',
        storageProvider: boxAddon,
        accountOwner: addonUser,
        authorizedResource: addonFile5,
        baseAccount: boxAccount,
        connectedCapabilities: [ConnectedCapabilities.Access, ConnectedCapabilities.Update],
        connectedOperationNames: [ConnectedOperationNames.CopyInto],
        iconUrl: `${assetsPrefix}assets/images/addons/icons/box.png`,
    });

    create0CedarMetadataFile(server, currentUser, filesNode, filesNodeOsfStorage);
    create3CedarMetadataFile(server, currentUser);
    create12CedarMetadataFile(server, currentUser, filesNode, filesNodeOsfStorage);

    // NOTE: Some institutions are already created by this point
    server.createList('institution', 20);
    // Create a specific institution to test institutional dashboard with; should be ID 29 at this point
    server.create('institution', {
        id: 'has-users',
    }, 'withMetrics');
}

function create0CedarMetadataFile(server: Server, currentUser: ModelInstance<User>,
    filesNode: ModelInstance<NodeModel & MirageNode>, filesNodeOsfStorage: ModelInstance<FileProviderModel>): void {
    server.create('file', {
        id: '0-cedar-metadata-file',
        name: 'cedar metadata file with no records',
        checkout: currentUser.id,
        target: filesNode,
        parentFolder: filesNodeOsfStorage.rootFolder,
    });
}


function create3CedarMetadataFile(server: Server, currentUser: ModelInstance<User>): void {

    const filesNode = server.create('node', {
        id: 'read-only',
        title: 'Read-only user and non-admin and a super long name to see if there is overflow into the right nav area',
        boaEnabled: true,
        currentUserPermissions: [Permission.Read],
    }, 'withFiles', 'withStorage', 'withContributors', 'withAffiliatedInstitutions', 'withDoi', 'withLinkedByNodes');

    const filesNodeOsfStorage = filesNode.files.models.filter(
        (provider: ModelInstance<FileProviderModel>) => provider.name === 'osfstorage',
    )[0] as ModelInstance<FileProviderModel>;

    const cedarFileNode = server.create('file', {
        id: '3-cedar-metadata-file',
        // eslint-disable-next-line max-len
        name: 'Cedar Metadata File on a read-only user and non-admin with a super long name to see if there is overflow in the right nav area',
        checkout: currentUser.id,
        target: filesNode,
        parentFolder: filesNodeOsfStorage.rootFolder,
    });

    const cedarMetadataRecords = server.createList('cedar-metadata-record', 2);
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isTesting'));

    cedarFileNode.update({
        cedarMetadataRecords,
    });
}

function create12CedarMetadataFile(server: Server, currentUser: ModelInstance<User>,
    filesNode: ModelInstance<NodeModel & MirageNode>, filesNodeOsfStorage: ModelInstance<FileProviderModel>): void {
    const cedarFileNode = server.create('file', {
        id: '12-cedar-metadata-file',
        name: 'cedar metadata file',
        checkout: currentUser.id,
        target: filesNode,
        parentFolder: filesNodeOsfStorage.rootFolder,
    });

    const cedarMetadataRecords = server.createList('cedar-metadata-record', 8);
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isDraft'));
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isDraft'));
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isDraft'));
    cedarMetadataRecords.push(server.create('cedar-metadata-record', 'isTesting'));

    cedarFileNode.update({
        cedarMetadataRecords,
    });
}

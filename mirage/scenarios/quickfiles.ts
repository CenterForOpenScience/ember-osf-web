import { ModelInstance, Server } from 'ember-cli-mirage';

import { StorageStatus } from 'ember-osf-web/models/node-storage';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

export function quickfilesScenario(server: Server, currentUser: ModelInstance<User>) {
    const overPrivateNode = server.create('node', {
        id: 'ovpri',
        title: 'Over the Private Storage Limit',
        public: false,
        currentUserPermissions: Object.values(Permission),
    }, 'withStorage');
    overPrivateNode.storage.update({ storageLimitStatus: StorageStatus.OVER_PRIVATE });

    const approachingPrivateNode = server.create('node', {
        id: 'appri',
        title: 'Approaching the Private Storage Limit',
        public: false,
        currentUserPermissions: Object.values(Permission),
    }, 'withStorage');
    approachingPrivateNode.storage.update({ storageLimitStatus: StorageStatus.APPROACHING_PRIVATE });

    const overPublicNode = server.create('node', {
        id: 'ovpub',
        title: 'Over the Public Storage Limit',
        currentUserPermissions: Object.values(Permission),
    }, 'withStorage');
    overPublicNode.storage.update({ storageLimitStatus: StorageStatus.OVER_PUBLIC });

    const approachingPublicNode = server.create('node', {
        id: 'appub',
        title: 'Approaching the Public Storage Limit',
        currentUserPermissions: Object.values(Permission),
    }, 'withStorage');
    approachingPublicNode.storage.update({ storageLimitStatus: StorageStatus.APPROACHING_PUBLIC });

    const notCalculatedNode = server.create('node', {
        id: 'noCal',
        public: false,
        title: 'Storage Status not calculated',
        currentUserPermissions: Object.values(Permission),
    }, 'withStorage');
    approachingPublicNode.storage.update({ storageLimitStatus: StorageStatus.NOT_CALCULATED });

    const nodes = [overPrivateNode, approachingPrivateNode, overPublicNode, approachingPublicNode, notCalculatedNode];
    for (const node of nodes) {
        server.create('contributor', {
            node,
            users: currentUser,
            permission: Permission.Admin,
            index: 0,
        });
    }
    server.createList('file', 8, { user: currentUser });
}

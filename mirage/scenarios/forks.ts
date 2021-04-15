import { ModelInstance, Server } from 'ember-cli-mirage';

import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

import { forkNode } from '../helpers';

export function forksScenario(server: Server, currentUser: ModelInstance<User>) {
    const forksNode = server.create('node', { id: 'fork5', currentUserPermissions: Object.values(Permission) });
    server.create('contributor', {
        node: forksNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });
    forkNode(server, forksNode, { currentUserPermissions: Object.values(Permission) });
}

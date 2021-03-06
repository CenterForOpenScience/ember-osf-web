import { ModelInstance, Server } from 'ember-cli-mirage';

import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

export function collectionScenario(server: Server, currentUser: ModelInstance<User>) {
    const licensesAcceptable = server.schema.licenses.all().models;
    const primaryCollection = server.create('collection');
    const nodeToBeAdded = server.create('node', {
        title: 'Node to be added to collection',
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeToBeAdded,
        users: currentUser,
        index: 0,
    });
    const nodeAdded = server.create('node', {
        description: 'A random description',
        title: 'Added to collection',
        license: licensesAcceptable[0],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeAdded,
        users: currentUser,
        index: 0,
    });
    server.create('collected-metadatum', {
        creator: currentUser,
        guid: nodeAdded,
        id: nodeAdded.id,
        collection: primaryCollection,
    });
    server.create('collected-metadatum', {
        creator: currentUser,
        guid: server.create('node', 'withContributors'),
        collection: primaryCollection,
    });
    server.create('collected-metadatum', {
        creator: currentUser,
        guid: server.create('node', 'withContributors'),
        collection: primaryCollection,
    });
    server.create('collection-provider', {
        id: 'studyswap',
        primaryCollection,
        licensesAcceptable,
    });
}

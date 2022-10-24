import { ModelInstance, Server } from 'ember-cli-mirage';
import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';

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
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodeAdded,
        id: nodeAdded.id,
        collection: primaryCollection,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: server.create('node', 'withContributors'),
        collection: primaryCollection,
    });
    server.create('collection-submission', {
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

export function collectionPendingScenario(server: Server, currentUser: ModelInstance<User>) {
    const licensesAcceptable = server.schema.licenses.all().models;
    const primaryCollection = server.create('collection');
    const nodeToBeAdded = server.create('node', {
        title: 'Pending Node to be added to collection',
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeToBeAdded,
        users: currentUser,
        index: 0,
    });
    const nodePending = server.create('node', {
        description: 'A pending project request to the Pending Collection Example',
        title: 'Pending Project Request',
        license: licensesAcceptable[0],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodePending,
        users: currentUser,
        index: 0,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodePending,
        id: nodePending.id,
        reviewsState: CollectionSubmissionReviewStates.Pending,
        collection: primaryCollection,
    });

    const nodeAccepted = server.create('node', {
        description: 'An acceped project on the Pending Collection Example',
        title: 'Accepted Project on the Pending Collection Example',
        license: licensesAcceptable[0],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeAccepted,
        users: currentUser,
        index: 0,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodeAccepted,
        id: nodeAccepted.id,
        collection: primaryCollection,
    });
    server.create('collection-provider', {
        id: 'pending-collection-example',
        primaryCollection,
        licensesAcceptable,
    });
}

export function collectionAcceptedScenario(server: Server, currentUser: ModelInstance<User>) {
    const licensesAcceptable = server.schema.licenses.all().models;
    const primaryCollection = server.create('collection');
    const nodeToBeAdded = server.create('node', {
        title: 'Accepted Node to be added to collection',
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeToBeAdded,
        users: currentUser,
        index: 0,
    });
    const nodeAdded = server.create('node', {
        description: 'An accepted project on the Accepted Collection Example',
        title: 'Accepted Project',
        license: licensesAcceptable[1],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeAdded,
        users: currentUser,
        index: 0,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodeAdded,
        id: nodeAdded.id,
        collection: primaryCollection,
    });
    server.create('collection-provider', {
        id: 'accepted-collection-example',
        primaryCollection,
        licensesAcceptable,
    });
}

export function collectionRejectedScenario(server: Server, currentUser: ModelInstance<User>) {
    const licensesAcceptable = server.schema.licenses.all().models;
    const primaryCollection = server.create('collection');
    const nodeToBeAdded = server.create('node', {
        title: 'Rejected Node on a collection',
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeToBeAdded,
        users: currentUser,
        index: 0,
    });
    const nodeAdded = server.create('node', {
        description: 'A rejected project on the Rejected Collection Example',
        title: 'Rejected Project',
        license: licensesAcceptable[1],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeAdded,
        users: currentUser,
        index: 0,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodeAdded,
        id: nodeAdded.id,
        reviewsState: CollectionSubmissionReviewStates.Rejected,
        collection: primaryCollection,
    });
    const nodeAccepted = server.create('node', {
        description: 'An acceped project on the Rejected Collection Example',
        title: 'Accepted Project on the Rejected Collection Example',
        license: licensesAcceptable[0],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeAccepted,
        users: currentUser,
        index: 0,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodeAccepted,
        id: nodeAccepted.id,
        collection: primaryCollection,
    });
    server.create('collection-provider', {
        id: 'rejected-collection-example',
        primaryCollection,
        licensesAcceptable,
    });
}

export function collectionRemovedScenario(server: Server, currentUser: ModelInstance<User>) {
    const licensesAcceptable = server.schema.licenses.all().models;
    const primaryCollection = server.create('collection');
    const nodeToBeAdded = server.create('node', {
        title: 'Removed Node on a collection',
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeToBeAdded,
        users: currentUser,
        index: 0,
    });
    const nodeAdded = server.create('node', {
        description: 'A removed project on the Removed Collection Example',
        title: 'Removed Project',
        license: licensesAcceptable[1],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeAdded,
        users: currentUser,
        index: 0,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodeAdded,
        id: nodeAdded.id,
        reviewsState: CollectionSubmissionReviewStates.Rejected,
        collection: primaryCollection,
    });
    const nodeAccepted = server.create('node', {
        description: 'An acceped project on the Removed Collection Example',
        title: 'Accepted Project on the Removed Collection Example',
        license: licensesAcceptable[0],
        currentUserPermissions: Object.values(Permission),
    });
    server.create('contributor', {
        node: nodeAccepted,
        users: currentUser,
        index: 0,
    });
    server.create('collection-submission', {
        creator: currentUser,
        guid: nodeAccepted,
        id: nodeAccepted.id,
        collection: primaryCollection,
    });
    server.create('collection-provider', {
        id: 'removed-collection-example',
        primaryCollection,
        licensesAcceptable,
    });
}

import { ModelInstance, Server } from 'ember-cli-mirage';
import CollectionModel from 'ember-osf-web/models/collection';
import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import LicenseModel from 'ember-osf-web/models/license';
import faker from 'faker';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

/**
 * collectionScenario
 *
 * @description Builds a Collection with 3 accepted projects and a project not
 * associated with a collection
 *
 * @param server The injected server
 * @param currentUser The injected current user
 */
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

    acceptedProject({
        server,
        currentUser,
        collection: primaryCollection,
        license: licensesAcceptable[0],
        title: 'Added to collection',
    } as ProjectBuilderArgument);

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

/**
 * collectionModerationScenario
 *
 * @description Builds a moderation collection with projects in a variey of review states
 *
 * @param server The injected server
 * @param currentUser The injected current user
 */
export function collectionModerationScenario(server: Server, currentUser: ModelInstance<User>) {
    const licensesAcceptable = server.schema.licenses.all().models;
    const primaryCollection = server.create('collection');

    [1,2,3,4,5].forEach((suffix: number) => {
        pendingProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Pending Project Request - ${suffix}`,
        } as ProjectBuilderArgument);
    });

    [1,2].forEach((suffix: number) => {
        acceptedProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Accepted Project - ${suffix}`,
        } as ProjectBuilderArgument);
    });

    [1,2,3,4,5,6,7].forEach((suffix: number) => {
        removedProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Removed Project - ${suffix}`,
        } as ProjectBuilderArgument);
    });

    [1,2,3,4,5,6,7,8,9,10].forEach((suffix: number) => {
        rejectedProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `RejectedProject - ${suffix}`,
        } as ProjectBuilderArgument);
    });

    server.create('collection-provider', {
        id: 'collection-moderation',
        primaryCollection,
        licensesAcceptable,
    });
}

/**
 * ProjectBuilderArgument
 *
 * @description A simple abstraction to simplify creation of projects in different
 * review states
 */
interface ProjectBuilderArgument {
    /**
     * The server attribute
     */
    server: Server;
    /**
     * The current user attribute
     */
    currentUser: ModelInstance<User>;
    /**
     * The collection to build the association
     */
    collection: ModelInstance<CollectionModel>;
    /**
     * The single license from the license array
     */
    license: ModelInstance<LicenseModel>;
    /**
     * The project title
     */
    title: string;
}


/**
 * projectBuilder
 *
 * @description Abstracted function to easily build a project in a certain review state
 *
 * @param project The project model
 * @param reviewsState The review state
 */
function projectBuilder(project: ProjectBuilderArgument, reviewsState: CollectionSubmissionReviewStates) {
    const node = project.server.create('node', {
        description: faker.lorem.sentence(),
        title: project.title,
        license: project.license,
        currentUserPermissions: Object.values(Permission),
    });
    project.server.create('contributor', {
        node,
        users: project.currentUser,
        index: 0,
    });
    project.server.create('collection-submission', {
        creator: project.currentUser,
        guid: node,
        id: node.id,
        reviewsState,
        collection: project.collection,
    });
}

/**
 * pendingProject
 *
 * @description Abstracted function to easily build a pending project
 * @param project The project model
 */
function pendingProject(project: ProjectBuilderArgument) {
    projectBuilder(project, CollectionSubmissionReviewStates.Pending);
}

/**
 * removedProject
 *
 * @description Abstracted function to easily build a removed project
 * @param project The project model
 */
function removedProject(project: ProjectBuilderArgument) {
    projectBuilder(project, CollectionSubmissionReviewStates.Removed);
}

/**
 * rejectedProject
 *
 * @description Abstracted function to easily build a rejected project
 * @param project The project model
 */
function rejectedProject(project: ProjectBuilderArgument) {
    projectBuilder(project, CollectionSubmissionReviewStates.Rejected);
}

/**
 * acceptedProject
 *
 * @description Abstracted function to easily build an accepted project
 * @param project The project model
 */
function acceptedProject(project: ProjectBuilderArgument) {
    projectBuilder(project, CollectionSubmissionReviewStates.Accepted);
}

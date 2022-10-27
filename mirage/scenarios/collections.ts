import { ModelInstance, Server } from 'ember-cli-mirage';
import CollectionModel from 'ember-osf-web/models/collection';
import CollectionSubmissionModel,
{ CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import LicenseModel from 'ember-osf-web/models/license';
import faker from 'faker';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';

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
        const collectionSubmission = pendingProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Pending Project Request - ${suffix}`,
        } as ProjectBuilderArgument);

        collectionSubmissionActionBuilder({
            target: collectionSubmission,
            creator: currentUser,
            server,
        } as CollectionSubmissionActionArgument);

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
 * @description A simple interface to simplify the creation of projects in different
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
 * CollectionSubmissionActionArgument
 *
 * @description A simple object to simplify the creation of collection submission actions in different
 */
interface CollectionSubmissionActionArgument {
    /**
     * The server attribute
     */
    server: Server;
    /**
     * The from state attribute
     */
    fromState?: CollectionSubmissionReviewStates;
    /**
     * The to state attribute
     */
    toState?: CollectionSubmissionReviewStates;
    /**
     * The action trigger attribute
     */
    actionTrigger?: CollectionSubmissionActionTrigger;
    /**
     * The creator attribute as the current user
     */
    creator: ModelInstance<User>;
    /**
     * The target as the collection submission
     */
    target: ModelInstance<CollectionSubmissionModel>;
    /**
     * The date the action was created
     */
    dateCreated?: Date;
    /**
     * The date the action was modified
     */
    dateModified?: Date;
    /**
     * The comment as the reason the action was taken (justification)
     */
    comment?: string;
}


/**
 * projectBuilder
 *
 * @description Abstracted function to easily build a project in a certain review state
 *
 * @param projectBuilderArgument The project builder argument model
 * @param reviewsState The review state
 *
 * @returns Return the newly created collection submission model
 */
function projectBuilder(
    projectBuilderArgument: ProjectBuilderArgument,
    reviewsState: CollectionSubmissionReviewStates,
): ModelInstance<CollectionSubmissionModel> {
    const node = projectBuilderArgument.server.create('node', {
        description: faker.lorem.sentence(),
        title: projectBuilderArgument.title,
        license: projectBuilderArgument.license,
        currentUserPermissions: Object.values(Permission),
    });
    projectBuilderArgument.server.create('contributor', {
        node,
        users: projectBuilderArgument.currentUser,
        index: 0,
    });
    return projectBuilderArgument.server.create('collection-submission', {
        creator: projectBuilderArgument.currentUser,
        guid: node,
        id: node.id,
        reviewsState,
        collection: projectBuilderArgument.collection,
    });
}

/**
 * pendingProject
 *
 * @description Abstracted function to easily build a pending project
 * @param projectBuilderArgument The project builder argument
 *
 * @returns Return the newly created collection submission model
 */
function pendingProject(projectBuilderArgument: ProjectBuilderArgument): ModelInstance<CollectionSubmissionModel> {
    return projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Pending);
}

/**
 * removedProject
 *
 * @description Abstracted function to easily build a removed project
 * @param projectBuilderArgument The project builder argument
 *
 * @returns Return the newly created collection submission model
 */
function removedProject(projectBuilderArgument: ProjectBuilderArgument): ModelInstance<CollectionSubmissionModel> {
    return projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Removed);
}

/**
 * rejectedProject
 *
 * @description Abstracted function to easily build a rejected project
 * @param projectBuilderArgument The project builder argument
 *
 * @returns Return the newly created collection submission model
 */
function rejectedProject(projectBuilderArgument: ProjectBuilderArgument): ModelInstance<CollectionSubmissionModel> {
    return projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Rejected);
}

/**
 * acceptedProject
 *
 * @description Abstracted function to easily build an accepted project
 * @param projectBuilderArgument The project builder argument
 *
 * @returns Return the newly created collection submission model
 */
function acceptedProject(projectBuilderArgument: ProjectBuilderArgument): ModelInstance<CollectionSubmissionModel> {
    return projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Accepted);
}

/**
 * collectionSubmissionActionBuilder
 *
 * @description Abstracted function to easily build a collection submission action
 *
 * @param project The project model
 * @param reviewsState The review state
 */
function collectionSubmissionActionBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    collectionSubmissionActionArgument.server.create('collection-submission-action', {
        fromState: collectionSubmissionActionArgument.fromState,
    });
}

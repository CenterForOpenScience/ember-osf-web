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
        collectionSubmissionActionArgument: { } as CollectionSubmissionActionArgument,
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
            collectionSubmissionActionArgument: { } as CollectionSubmissionActionArgument,
        } as ProjectBuilderArgument);
    });

    [1,2].forEach((suffix: number) => {
        acceptedProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Accepted Project - ${suffix}`,
            collectionSubmissionActionArgument: {
                comment: 'I love this project',
            } as CollectionSubmissionActionArgument,
        } as ProjectBuilderArgument);
    });

    [1,2,3,4,5,6,7].forEach((suffix: number) => {
        removedProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Removed Project - ${suffix}`,
            collectionSubmissionActionArgument: {
                isAdminRemove: suffix % 2 ? true : false,
            } as CollectionSubmissionActionArgument,
        } as ProjectBuilderArgument);
    });

    [1,2,3,4,5,6,7,8,9,10].forEach((suffix: number) => {
        rejectedProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `RejectedProject - ${suffix}`,
            collectionSubmissionActionArgument: {
                comment: 'Do you even know how to project?',
            } as CollectionSubmissionActionArgument,
        } as ProjectBuilderArgument);
    });

    [1,2,3,4].forEach((suffix: number) => {
        resubmitProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Removed Project - ${suffix}`,
            collectionSubmissionActionArgument: {
                isAdminRemove: suffix % 2 ? true : false,
            } as CollectionSubmissionActionArgument,
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
    /**
     * The collection submission action arguments
     */
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument;
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
    /**
     * The is admin remove determines if an admin or moderator removed the project from the collection
     */
    isAdminRemove?: boolean;
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
 */
function pendingProject(projectBuilderArgument: ProjectBuilderArgument): void {
    const collectionSubmission = projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Pending);

    const collectionSubmissionActionArguments = buildCollectionSubmissionActionArgument(
        projectBuilderArgument, collectionSubmission,
    );

    pendingCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );
}

/**
 * removedProject
 *
 * @description Abstracted function to easily build a removed project
 * @param projectBuilderArgument The project builder argument
 *
 */
function removedProject(projectBuilderArgument: ProjectBuilderArgument): void {
    const collectionSubmission = projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Removed);

    const collectionSubmissionActionArguments = buildCollectionSubmissionActionArgument(
        projectBuilderArgument, collectionSubmission,
    );

    pendingCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );

    acceptedCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );

    removedCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );
}

/**
 * resubmitProject
 *
 * @description Abstracted function to easily build a submit project
 * @param projectBuilderArgument The project builder argument
 */
function resubmitProject(projectBuilderArgument: ProjectBuilderArgument): void {
    const collectionSubmission = projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Removed);

    const collectionSubmissionActionArguments = buildCollectionSubmissionActionArgument(
        projectBuilderArgument, collectionSubmission,
    );

    pendingCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );

    acceptedCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );

    removedCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );

    resubmitCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );
}

/**
 * rejectedProject
 *
 * @description Abstracted function to easily build a rejected project
 * @param projectBuilderArgument The project builder argument
 *
 */
function rejectedProject(projectBuilderArgument: ProjectBuilderArgument): void {
    const collectionSubmission = projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Rejected);

    const collectionSubmissionActionArguments = buildCollectionSubmissionActionArgument(
        projectBuilderArgument, collectionSubmission,
    );

    pendingCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );

    rejectedCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );
}

/**
 * acceptedProject
 *
 * @description Abstracted function to easily build an accepted project
 * @param projectBuilderArgument The project builder argument
 *
 */
function acceptedProject(projectBuilderArgument: ProjectBuilderArgument): void {
    const collectionSubmission = projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Accepted);

    const collectionSubmissionActionArguments = buildCollectionSubmissionActionArgument(
        projectBuilderArgument, collectionSubmission,
    );

    pendingCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );

    acceptedCollectionSubmissionActionBuilder(
        collectionSubmissionActionArguments,
    );
}

/**
 * collectionSubmissionActionBuilder
 *
 * @description Abstracted function to easily build a collection submission action
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 * @param fromState The collection submission review from state
 * @param toState The collection submission review to state
 * @param actionTrigger The colleciton submission action trigger
 */
function collectionSubmissionActionBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
    fromState: CollectionSubmissionReviewStates,
    toState: CollectionSubmissionReviewStates,
    actionTrigger: CollectionSubmissionActionTrigger,
): void {
    collectionSubmissionActionArgument.server.create('collection-submission-action', {
        fromState,
        toState,
        actionTrigger,
        target: collectionSubmissionActionArgument.target,
        creator: collectionSubmissionActionArgument.creator,
        comment: collectionSubmissionActionArgument.comment,
    });
}

/**
 * acceptedCollectionSubmissionActionBuilder
 *
 * @description Abstracted function to easily build an accepted collection submission action
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 */
function acceptedCollectionSubmissionActionBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    /**
     * Faker on accepted
     */
    collectionSubmissionActionArgument.comment = faker.lorem.sentence();

    collectionSubmissionActionBuilder(collectionSubmissionActionArgument,
        CollectionSubmissionReviewStates.Pending,
        CollectionSubmissionReviewStates.Accepted,
        CollectionSubmissionActionTrigger.Accept);
}

/**
 * pendingCollectionSubmissionActionBuilder
 *
 * @description Abstracted function to easily build an pending collection submission action
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 */
function pendingCollectionSubmissionActionBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    /**
     * There is no justification on submission actions
     */
    delete collectionSubmissionActionArgument.comment;
    collectionSubmissionActionBuilder(collectionSubmissionActionArgument,
        CollectionSubmissionReviewStates.InProgress,
        CollectionSubmissionReviewStates.Pending,
        CollectionSubmissionActionTrigger.Submit);
}

/**
 * removedCollectionSubmissionActionByModeratorBuilder
 *
 * @description Abstracted function to easily build a removed collection submission action by the collection moderator
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 */
function removedCollectionSubmissionActionByModeratorBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    collectionSubmissionActionBuilder(collectionSubmissionActionArgument,
        CollectionSubmissionReviewStates.Accepted,
        CollectionSubmissionReviewStates.Removed,
        CollectionSubmissionActionTrigger.ModeratorRemove);
}

/**
 * removedCollectionSubmissionActionByAdminBuilder
 *
 * @description Abstracted function to easily build a removed collection submission action by the project admin
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 */
function removedCollectionSubmissionActionByAdminBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    collectionSubmissionActionBuilder(collectionSubmissionActionArgument,
        CollectionSubmissionReviewStates.Accepted,
        CollectionSubmissionReviewStates.Removed,
        CollectionSubmissionActionTrigger.AdminRemove);
}

/**
 * removedCollectionSubmissionActionBuilder
 *
 * @description Abstracted function to easily build a removed collection submission action
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 */
function removedCollectionSubmissionActionBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    /**
     * Faker on accepted
     */
    collectionSubmissionActionArgument.comment = collectionSubmissionActionArgument.isAdminRemove ?
        'I am making my project private' :
        'This project is no longer relevant';

    if (collectionSubmissionActionArgument.isAdminRemove) {
        removedCollectionSubmissionActionByAdminBuilder(collectionSubmissionActionArgument);
    } else {
        removedCollectionSubmissionActionByModeratorBuilder(collectionSubmissionActionArgument);
    }
}

/**
 * rejectedCollectionSubmissionActionBuilder
 *
 * @description Abstracted function to easily build a rejected collection submission action
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 */
function rejectedCollectionSubmissionActionBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    collectionSubmissionActionArgument.comment =
        'I can not even ... on this project ... ';
    collectionSubmissionActionBuilder(collectionSubmissionActionArgument,
        CollectionSubmissionReviewStates.Pending,
        CollectionSubmissionReviewStates.Rejected,
        CollectionSubmissionActionTrigger.Reject);
}

/**
 * resubmitCollectionSubmissionActionBuilder
 *
 * @description Abstracted function to easily build a resubmit collection submission action by the project admin
 *
 * @param collectionSubmissionActionArgument The collection submission action argument interface
 */
function resubmitCollectionSubmissionActionBuilder(
    collectionSubmissionActionArgument: CollectionSubmissionActionArgument,
): void {
    collectionSubmissionActionArgument.comment =
        'Please let me back in ... please ... please!';
    collectionSubmissionActionBuilder(collectionSubmissionActionArgument,
        CollectionSubmissionReviewStates.Removed,
        CollectionSubmissionReviewStates.Pending,
        CollectionSubmissionActionTrigger.Submit);
}
/**
 * buildCollectionSubmissionActionArgument
 *
 * @description Abstracted function to easily build a collection submission action argument
 *
 * @param projectBuilderArgument The project builder argument
 * @param collectionSubmission The collection submission
 */
function buildCollectionSubmissionActionArgument(
    projectBuilderArgument: ProjectBuilderArgument,
    collectionSubmission: ModelInstance<CollectionSubmissionModel>,
): CollectionSubmissionActionArgument  {

    projectBuilderArgument.collectionSubmissionActionArgument.target = collectionSubmission;
    projectBuilderArgument.collectionSubmissionActionArgument.creator = projectBuilderArgument.currentUser;
    projectBuilderArgument.collectionSubmissionActionArgument.server = projectBuilderArgument.server;

    return projectBuilderArgument.collectionSubmissionActionArgument;
}

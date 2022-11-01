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

    projectBuilder({
        server,
        currentUser,
        collection: primaryCollection,
        license: licensesAcceptable[0],
        title: 'Added to collection',
        collectionSubmissionActionArgument: { } as CollectionSubmissionActionArgument,
    }  as ProjectBuilderArgument, CollectionSubmissionReviewStates.Accepted);

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
        projectBuilder({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Pending Project Request - ${suffix}`,
            collectionSubmissionActionArgument: buildInitialCollectionSubmissionActionArguments(),
        }  as ProjectBuilderArgument, CollectionSubmissionReviewStates.Pending);
    });

    [1,2].forEach((suffix: number) => {
        projectBuilder({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Accepted Project - ${suffix}`,
            collectionSubmissionActionArgument: buildInitialCollectionSubmissionActionArguments(
                'You really make this project great',
            ),
        }  as ProjectBuilderArgument, CollectionSubmissionReviewStates.Accepted);
    });

    [1,2,3,4,5,6,7].forEach((suffix: number) => {
        projectBuilder({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Removed Project - ${suffix}`,
            collectionSubmissionActionArgument: buildInitialCollectionSubmissionActionArguments(
                'Thanks for being part of our project',
                suffix % 2 ? true : false,
            ),
        }  as ProjectBuilderArgument, CollectionSubmissionReviewStates.Removed);
    });

    [1,2,3,4,5,6,7,8,9,10].forEach((suffix: number) => {
        projectBuilder({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `RejectedProject - ${suffix}`,
            collectionSubmissionActionArgument: buildInitialCollectionSubmissionActionArguments(),
        }  as ProjectBuilderArgument, CollectionSubmissionReviewStates.Rejected);
    });

    [1,2,3,4].forEach((suffix: number) => {
        projectBuilder({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Removed Project - ${suffix}`,
            collectionSubmissionActionArgument: buildInitialCollectionSubmissionActionArguments(
                'I hope to never lose you',
                suffix % 2 ? true : false,
                true,
            ),
        }  as ProjectBuilderArgument, CollectionSubmissionReviewStates.Removed);
    });

    [1,2,3,4,5].forEach((suffix: number) => {
        chaosProject({
            server,
            currentUser,
            collection: primaryCollection,
            license: licensesAcceptable[0],
            title: `Removed Project - ${suffix}`,
            collectionSubmissionActionArgument: { } as CollectionSubmissionActionArgument,
        } as ProjectBuilderArgument);
    });

    server.create('collection-provider', {
        id: 'collection-moderation',
        primaryCollection,
        licensesAcceptable,
    });
}

/**
 * buildInitialCollectionSubmissionActionArguments
 *
 * @description Builds an initial base collection submission action argument
 *
 * @params comment The comment/justification the moderation
 * @params isAdminRemove if the remove submission is initiated by a project admin
 * @params isResubmit if the removed submission is to be resubmitted
 *
 * @returns a collection submission action argument interface
 */
function buildInitialCollectionSubmissionActionArguments(comment?: string,
    isAdminRemove?: boolean, isResubmit?: boolean): CollectionSubmissionActionArgument {

    const pastDateCreated = faker.random.number({
        min: 0,
        max: faker.random.number(2),
    });

    const pastDateModified = pastDateCreated - faker.random.number({
        min: 0,
        max: 1,
    });

    return {
        comment,
        isResubmit,
        dateCreated: faker.date.past(pastDateCreated),
        dateModified: faker.date.past(pastDateModified),
        isAdminRemove,
    } as CollectionSubmissionActionArgument;
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
 * @description A simple object to simplify the creation of collection submission actions with customized attributes
 */
interface CollectionSubmissionActionArgument {
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
    /**
     * The is resubmit determines if a removed project is resubmitted to the collection
     */
    isResubmit?: boolean;
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
        submissionAction: projectBuilderArgument.collectionSubmissionActionArgument,
    });
}

/**
 * chaosProject
 *
 * @description Abstracted function to easily build a chaos project
 * @param projectBuilderArgument The project builder argument
 */
function chaosProject(projectBuilderArgument: ProjectBuilderArgument): void {
    const collectionSubmission = projectBuilder(projectBuilderArgument, CollectionSubmissionReviewStates.Accepted);

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(365),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Rejected,
        actionTrigger: CollectionSubmissionActionTrigger.Reject,
        target: collectionSubmission,
        comment: 'I do not like your project.',
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(355),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(345),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Accepted,
        actionTrigger: CollectionSubmissionActionTrigger.Accept,
        comment: 'You have really improved your project. Welcome!',
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(335),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Accepted,
        toState: CollectionSubmissionReviewStates.Removed,
        actionTrigger: CollectionSubmissionActionTrigger.AdminRemove,
        comment: 'I am taking my project private.',
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(325),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        comment: 'Back, Back in black ...',
        dateCreated: getMinusDate(315),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Rejected,
        actionTrigger: CollectionSubmissionActionTrigger.Reject,
        target: collectionSubmission,
        comment: 'Fool me once and not again.',
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(305),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        comment: 'Oh, come one ... let me in little pig',
        dateCreated: getMinusDate(295),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Accepted,
        actionTrigger: CollectionSubmissionActionTrigger.Accept,
        comment: 'Okay, you get one more chance!',
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(285),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Accepted,
        toState: CollectionSubmissionReviewStates.Removed,
        actionTrigger: CollectionSubmissionActionTrigger.ModeratorRemove,
        comment: 'Your last chance is over buddy.',
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(275),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        comment: 'Have a heart, Batman! Namaste ...',
        dateCreated: getMinusDate(265),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Rejected,
        actionTrigger: CollectionSubmissionActionTrigger.Reject,
        target: collectionSubmission,
        comment: 'I have told you before I am not into hot yoga, Joker!',
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(255),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        comment: 'Catch me if you can spam man',
        dateCreated: getMinusDate(245),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Rejected,
        actionTrigger: CollectionSubmissionActionTrigger.Reject,
        target: collectionSubmission,
        comment: 'You thought I would not notice this horrible project?',
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(235),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        comment: 'Fine, I have made the chances you requested',
        dateCreated: getMinusDate(225),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Rejected,
        actionTrigger: CollectionSubmissionActionTrigger.Reject,
        target: collectionSubmission,
        comment: 'nope, Nope, NOPE!',
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(215),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        comment: 'Really, I have made all the changes to be worthy of your collection.',
        dateCreated: getMinusDate(205),
    });

    projectBuilderArgument.server.create('collection-submission-action', {
        fromState: CollectionSubmissionReviewStates.Pending,
        toState: CollectionSubmissionReviewStates.Accepted,
        actionTrigger: CollectionSubmissionActionTrigger.Accept,
        comment: 'You have made some good progress. Welcome back.',
        target: collectionSubmission,
        creator: projectBuilderArgument.currentUser,
        dateCreated: getMinusDate(195),
    });
}

/**
 * getMinusDate
 *
 * @description: A function to subtract a number of days from either now() or the passed in date
 * @param days The days to subtracted
 * @param currentDate The optional date to subtract from. Default is now()
 *
 * @returns a new date based on the days minused
 */
function getMinusDate(days: number, currentDate?: Date): Date {
    if (!currentDate) {
        currentDate = new Date(Date.now());
    }
    return new Date(Date.now() - 60 * 60 * 24 * days * 1000);
}

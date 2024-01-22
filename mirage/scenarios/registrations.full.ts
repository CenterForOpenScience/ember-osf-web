import { ModelInstance, Server } from 'ember-cli-mirage';

import { StorageStatus } from 'ember-osf-web/models/node-storage';
import { Permission } from 'ember-osf-web/models/osf-model';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { MirageRegistrationProvider } from 'ember-osf-web/mirage/factories/registration-provider';
import User from 'ember-osf-web/models/user';

import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import NodeModel from 'ember-osf-web/models/node';
import { MirageNode } from 'ember-osf-web/mirage/factories/node';
import LicenseModel from 'ember-osf-web/models/license';
import { registerNodeMultiple } from '../helpers';

export function registrationFullScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {

    const registrationResponses = {
        'page-one_long-text': '',
        'page-one_multi-select': ['Crocs'],
        'page-one_multi-select-other': '',
        'page-one_short-text': 'Ravioli',
        'page-one_single-select-two': 'Remember who was in NSync and who was in Backstreet Boys',
    };

    const provider = server.create('registration-provider',
        { id: 'ispor', name: 'ISPOR', allowSubmissions: true },
        'withBrand',
        'withSchemas');

    const licenseReqFields = server.schema.licenses.findBy({ name: 'MIT License' });

    const rootNode = createRootNode(server, currentUser);
    const egap = createEgapRegistrationProvider(server, currentUser);

    // Create some generic objects
    createGenericObjects(server);

    createBeefsRegistration(server);
    createSiliconRegistration(server, currentUser, egap);
    createTungstenRegistration(server, currentUser, egap);
    createCobaltRegistration(server, currentUser, egap);
    createBismuthRegistration(server, currentUser, egap);
    createWithdrawnRegistration(server, currentUser, egap);
    createAcceptRegistration(server, provider);
    createCubanRegistration(server, currentUser, egap);
    createPndwdRegistration(server, currentUser, egap);
    createAerchiveRegistration(server, currentUser, provider);
    createOpenEndedRegistration(server, currentUser, licenseReqFields);
    createBrandRegistration(server, currentUser, rootNode, licenseReqFields,registrationResponses);
    createRrpreRegistration(server, currentUser, rootNode, registrationResponses);
    createPregcRegistration(server, currentUser, rootNode, registrationResponses);
    createInitialRegistration(server, currentUser, egap);
}

function createRootNode(server: Server, currentUser: ModelInstance<User>): ModelInstance<NodeModel & MirageNode> {
    const rootNode = server.create('node', {
        id: 'anode',
        public: false,
        contributors: server.createList('contributor', 10),
        currentUserPermissions: Object.values(Permission),
    }, 'withFiles', 'withStorage');

    const currentUserWrite = server.create('registration', {
        id: 'writr',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        reviewsState: RegistrationReviewStates.Accepted,
        revisionState: RevisionReviewStates.Approved,
        currentUserPermissions: [Permission.Admin, Permission.Write],
        providerSpecificMetadata: [
            { field_name: 'Metadata field 1', field_value: '' },
            { field_name: 'Another Field', field_value: 'Value 2' },
        ],
        hasData: true,
        hasMaterials: false,
        hasAnalyticCode: true,
        hasPapers: false,
        hasSupplements: true,
    }, 'withResources', 'withDoi');

    server.create('file', {id: 'afile', target: currentUserWrite});

    server.create('schema-response', {
        id: 'copyEditWritr1',
        revisionJustification: 'Copy Edit',
        reviewsState: RevisionReviewStates.RevisionInProgress,
        revisionResponses: {
            q1: 'Hello',
            q2: ['List of greetings'],
        },
        initiatedBy: currentUser,
        registration: currentUserWrite,
    });

    server.create('contributor', { users: currentUser, node: currentUserWrite });

    rootNode.update({
        storage: server.create('node-storage', { storageLimitStatus: StorageStatus.OVER_PRIVATE }),
    });

    server.create('contributor', {
        node: rootNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });

    registerNodeMultiple(
        server,
        rootNode,
        2,
        { currentUserPermissions: Object.values(Permission) },
        'withArbitraryState',
    );

    const childNodeA = server.create('node', { parent: rootNode });
    server.create('node', { parent: childNodeA });
    server.create('node', { parent: childNodeA });

    return rootNode;

}

// eslint-disable-next-line max-len
function createEgapRegistrationProvider(server: Server, currentUser: ModelInstance<User>): ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>{
    const egap = server.create('registration-provider', { id: 'egap', name: 'EGAP' },
        'withBrand', 'currentUserIsModerator');
    server.create('moderator', { provider: egap });
    server.create('moderator', { id: currentUser.id, user: currentUser, provider: egap }, 'asAdmin');
    server.createList('moderator', 5, { provider: egap });

    server.createList('registration', 12, {
        reviewsState: RegistrationReviewStates.Pending,
        provider: egap,
    });

    return egap;
}

function createGenericObjects(server: Server): void {
    /* Create some generic stuff
    * need some subjects populated for making a draft registration
    * need the bookmark collection for some overview page functionaliaty,
    */
    server.createList('subject', 10, 'withChildren');
    server.create('collection', { title: 'Bookmarks', bookmarks: true });
    const clinicalTrials = server.create('external-provider', {
        shareSource: 'ClinicalTrials.gov',
    });
    const researchRegistry = server.create('external-provider', {
        shareSource: 'Research Registry',
    });

    server.createList('external-registration', 3, { provider: clinicalTrials });
    server.createList('external-registration', 2, { provider: researchRegistry });
}

/**
 * createBeefsRegistration
 *
 * @description Create the Beefs Registration
 *
 * @param server The server param
 * @param currentUser The current User
 */
function createBeefsRegistration(server: Server): void {
    server.create('registration', { id: 'beefs' });
}

function createSiliconRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {

    const silicon = server.create('registration', {
        id: 'silicon',
        title: 'Revision Model: Public View',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Accepted,
        registeredBy: currentUser,
        revisionState: RevisionReviewStates.Approved,
        currentUserPermissions: [Permission.Read],
        providerSpecificMetadata: [
            { field_name: 'IP Address', field_value: '127.0.0.1' },
            { field_name: 'Mac Address', field_value: 'b6:be:5a:05:ef:7a' },
        ],
        registrationResponses: {
            q1: 'Hello',
            q2: ['Array of greetings'],
        },
    }, 'withContributors', 'withReviewActions');

    server.create('schema-response', {
        id: 'copyEditSilicon',
        revisionJustification: 'Copy Edit',
        revisionResponses: {
            q1: 'Good Morning',
            q2: ['List of greetings'],
        },
        initiatedBy: currentUser,
        registration: silicon,
    });
}

function createTungstenRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {
    const tungsten = server.create('registration', {
        id: 'tungsten',
        title: 'Revision Model: Contributor View (non-Admin/Mod)',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Withdrawn,
        registeredBy: currentUser,
        revisionState: RevisionReviewStates.RevisionInProgress,
        currentUserPermissions: [Permission.Write],
        providerSpecificMetadata: [
            { field_name: 'IP Address', field_value: '127.0.0.1' },
            { field_name: 'Mac Address', field_value: 'b6:be:5a:05:ef:7a' },
        ],
        registrationResponses: {
            q1: 'Hello',
            q2: ['Array of greetings'],
        },
    }, 'withContributors', 'withReviewActions');

    server.create('schema-response', {
        id: 'copyEditTungsten',
        revisionJustification: 'Copy Edit',
        revisionResponses: {
            q1: 'Good Morning',
            q2: ['List of greetings'],
        },
        initiatedBy: currentUser,
        registration: tungsten,
    });
}

function createCobaltRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {
    const cobalt = server.create('registration', {
        id: 'cobalt',
        title: 'Revision Model: Contributor View (pending moderation)',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Accepted,
        registeredBy: currentUser,
        revisionState: RevisionReviewStates.RevisionPendingModeration,
        currentUserPermissions: [Permission.Read],
        providerSpecificMetadata: [
            { field_name: 'IP Address', field_value: '127.0.0.1' },
            { field_name: 'Mac Address', field_value: 'b6:be:5a:05:ef:7a' },
        ],
        registrationResponses: {
            q1: 'Hello',
            q2: ['Array of greetings'],
        },
    }, 'withContributors', 'withReviewActions');

    server.create('schema-response', {
        id: 'copyEditRPMCobalt',
        revisionJustification: 'Copy Edit',
        reviewsState: RevisionReviewStates.RevisionPendingModeration,
        revisionResponses: {
            q1: 'Good Morning',
            q2: ['List of greetings'],
        },
        initiatedBy: currentUser,
        registration: cobalt,
    });

    server.create('schema-response', {
        id: 'typoSelfRPMCobalt',
        reviewsState: RevisionReviewStates.RevisionPendingModeration,
        revisionJustification: 'Typo - Self',
        revisionResponses: {
            q1: 'Happy Morning',
            q2: ['Litany of greetings'],
        },
        initiatedBy: currentUser,
        registration: cobalt,
    });

    server.create('schema-response', {
        id: 'addResultsApprovedCobalt',
        reviewsState: RevisionReviewStates.Approved,
        revisionJustification: 'Adding Results',
        revisionResponses: {
            q1: 'Good Morning',
            q2: ['Rolodex of greetings'],
        },
        initiatedBy: currentUser,
        registration: cobalt,
    });
}

function createBismuthRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {

    server.create('registration', {
        id: 'bismuth',
        title: 'Revision Model: Admin or Moderator View',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Accepted,
        registeredBy: currentUser,
        revisionState: RevisionReviewStates.Approved,
        currentUserPermissions: Object.values(Permission),
        providerSpecificMetadata: [
            { field_name: 'IP Address', field_value: '127.0.0.1' },
            { field_name: 'Mac Address', field_value: 'b6:be:5a:05:ef:7a' },
        ],
        registrationResponses: {
            'page-one_long-text': 'eeeee',
            'page-one_multi-select': ['Crocs'],
        },
    }, 'withContributors', 'withReviewActions');
}


function createWithdrawnRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {
    const wdrwn = server.create('registration', {
        id: 'withdrawn',
        title: 'Withdrawn Hermit',
        withdrawn: true,
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Withdrawn,
    }, 'withContributors', 'withReviewActions');
    server.create('contributor', { users: currentUser, node: wdrwn });

    server.create('registration-subscription', {
        id: 'egap_new_pending_submissions',
        eventName: 'new_pending_submissions',
        frequency: SubscriptionFrequency.Daily,
        provider: egap,
    });
}

// eslint-disable-next-line max-len
function createAcceptRegistration(server: Server, provider: ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {
    server.create('registration', {
        id: 'accept',
        title: 'Acceptember',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider,
        reviewsState: RegistrationReviewStates.Accepted,
        providerSpecificMetadata: [
            { field_name: 'Metadata field 1', field_value: '' },
            { field_name: 'Another Field', field_value: 'Value 2' },
        ],
    }, 'withContributors');
}

function createCubanRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {
    const cuban = server.create('registration', {
        id: 'cuban',
        title: 'embargoed',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        registeredBy: currentUser,
        hasData: true,
        hasMaterials: true,
        hasAnalyticCode: true,
        hasPapers: true,
        hasSupplements: true,
    }, 'withContributors', 'withReviewActions', 'isEmbargo');

    server.create('contributor', { users: currentUser, node: cuban });
}

function createPndwdRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {
    const pndwd = server.create('registration', {
        id: 'pndwd',
        title: 'Cold Turkey',
        provider: egap,
        reviewsState: RegistrationReviewStates.PendingWithdraw,
    }, 'withSingleReviewAction');
    server.create('contributor', { users: currentUser, node: pndwd });
}

function createAerchiveRegistration(server: Server, currentUser: ModelInstance<User>,
    provider: ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {
    const aerchive = server.create('registration', {
        id: 'aerchive',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider,
    }, 'isArchiving');
    server.create('contributor', { users: currentUser, node: aerchive });
}

function createOpenEndedRegistration(server: Server, currentUser: ModelInstance<User>,
    licenseReqFields: ModelInstance<LicenseModel>): void {
    const draftNode = server.create('draft-node', 'withFiles');
    server.create('draft-registration', {
        id: 'open-ended',
        registrationSchema: server.schema.registrationSchemas.find('open_ended_registration'),
        initiator: currentUser,
        branchedFrom: draftNode,
        hasProject: false,
        license: licenseReqFields,
        currentUserPermissions: Object.values(Permission),
    }, 'withSubjects', 'withAffiliatedInstitutions', 'withContributors');
}

function createBrandRegistration(server: Server, currentUser: ModelInstance<User>,
    rootNode: ModelInstance<NodeModel & MirageNode>,
    licenseReqFields: ModelInstance<LicenseModel>,
    registrationResponses: {}): void {

    const provider = server.create('registration-provider',
        { id: 'ispor', name: 'ISPOR', allowSubmissions: true },
        'withBrand',
        'withSchemas');

    server.create('draft-registration', {
        id: 'brand',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        initiator: currentUser,
        registrationResponses,
        branchedFrom: rootNode,
        license: licenseReqFields,
        currentUserPermissions: [Permission.Read, Permission.Write],
        provider,
    }, 'withContributors');
}

function createRrpreRegistration(server: Server, currentUser: ModelInstance<User>,
    rootNode: ModelInstance<NodeModel & MirageNode>,
    registrationResponses: {}): void {

    server.create('draft-registration', {
        id: 'rrpre',
        registrationSchema: server.schema.registrationSchemas.find('replication_recipe_pre_registration'),
        initiator: currentUser,
        registrationResponses,
        branchedFrom: rootNode,
    });
}

function createPregcRegistration(server: Server, currentUser: ModelInstance<User>,
    rootNode: ModelInstance<NodeModel & MirageNode>,
    registrationResponses: {}): void {

    server.create('draft-registration', {
        id: 'pregc',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        initiator: currentUser,
        registrationResponses,
        branchedFrom: rootNode,
    });

}

function createInitialRegistration(server: Server, currentUser: ModelInstance<User>,
    egap:  ModelInstance<RegistrationProviderModel & MirageRegistrationProvider>): void {

    const intitial = server.create('registration', {
        id: 'initial',
        title: 'Initial Model: Contributor View',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Initial,
        registeredBy: currentUser,
        revisionState: RevisionReviewStates.RevisionInProgress,
        currentUserPermissions: [Permission.Write],
        providerSpecificMetadata: [
            { field_name: 'IP Address', field_value: '127.0.0.1' },
            { field_name: 'Mac Address', field_value: 'b6:be:5a:05:ef:7a' },
        ],
        registrationResponses: {
            q1: 'Hello',
            q2: ['Array of greetings'],
        },
    }, 'withContributors', 'withReviewActions');

    server.create('schema-response', {
        id: 'copyEditInitial',
        revisionJustification: 'Copy Edit',
        revisionResponses: {
            q1: 'Good Morning',
            q2: ['List of greetings'],
        },
        initiatedBy: currentUser,
        registration: intitial,
    });
}

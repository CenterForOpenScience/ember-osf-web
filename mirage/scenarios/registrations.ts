import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { StorageStatus } from 'ember-osf-web/models/node-storage';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { draftRegisterNodeMultiple, registerNodeMultiple } from '../helpers';

export function manyProjectRegistrationsScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    server.loadFixtures('citation-styles');

    const registrationNode = server.create(
        'node',
        {
            id: 'regis', currentUserPermissions: Object.values(Permission),
        },
        'withContributors',
    );
    server.create('contributor', {
        node: registrationNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });

    registerNodeMultiple(
        server,
        registrationNode,
        12,
        { currentUserPermissions: Object.values(Permission) },
        'withArbitraryState',
    );
    draftRegisterNodeMultiple(server, registrationNode, 12, {}, 'withRegistrationMetadata');
}

export function registrationScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const { defaultProvider } = config;
    server.loadFixtures('citation-styles');

    server.create('registration-provider', {
        id: defaultProvider,
        shareSource: 'OSF Registries',
        name: 'OSF Registries',
    }, 'withAllSchemas');

    server.create('registration', { id: 'beefs' });

    const currentUserWrite = server.create('registration', {
        id: 'writr',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        reviewsState: RegistrationReviewStates.Accepted,
        revisionState: RevisionReviewStates.Approved,
        currentUserPermissions: [Permission.Admin],
        providerSpecificMetadata: [
            { field_name: 'Metadata field 1', field_value: '' },
            { field_name: 'Another Field', field_value: 'Value 2' },
        ],
        hasData: true,
        hasMaterials: false,
    }, 'withResources');

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

    const registrationResponses = {
        'page-one_long-text': '',
        'page-one_multi-select': ['Crocs'],
        'page-one_multi-select-other': '',
        'page-one_short-text': 'Ravioli',
        'page-one_single-select-two': 'Remember who was in NSync and who was in Backstreet Boys',
    };

    const rootNode = server.create('node', {
        id: 'anode',
        public: false,
        contributors: server.createList('contributor', 10),
        currentUserPermissions: [Permission.Admin],
    }, 'withFiles', 'withStorage');
    rootNode.update({
        storage: server.create('node-storage', { storageLimitStatus: StorageStatus.OVER_PRIVATE }),
    });
    server.create('contributor', {
        node: rootNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });

    const childNodeA = server.create('node', { parent: rootNode });
    server.create('node', { parent: childNodeA });
    server.create('node', { parent: childNodeA });
    const licenseReqFields = server.schema.licenses.findBy({ name: 'MIT License' });
    const provider = server.create('registration-provider',
        { id: 'ispor', name: 'ISPOR', allowSubmissions: true },
        'withBrand',
        'withSchemas');

    const egap = server.create('registration-provider', { id: 'egap', name: 'EGAP' },
        'withBrand', 'currentUserIsModerator');
    server.create('moderator', { provider: egap });
    server.create('moderator', { id: currentUser.id, user: currentUser, provider: egap }, 'asAdmin');
    server.createList('moderator', 5, { provider: egap });

    const decaf = server.create('registration', {
        id: 'decaf',
        title: 'Pending Penguins',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Accepted,
        registeredBy: currentUser,
        revisionState: RevisionReviewStates.RevisionPendingModeration,
        currentUserPermissions: Object.values(Permission),
        providerSpecificMetadata: [
            { field_name: 'EGAP Registration ID', field_value: '' },
            { field_name: 'Another Field', field_value: 'aloha' },
        ],
        registrationResponses: {
            'page-one_long-text': 'aaaaa',
            'page-one_multi-select': ['Crocs'],
        },
        hasData: false,
        hasMaterials: true,
    }, 'withContributors', 'withReviewActions', 'withFiles');

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
    server.create('contributor', { users: currentUser, node: decaf });

    const cuban = server.create('registration', {
        id: 'cuban',
        title: 'embargoed',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        registeredBy: currentUser,
        hasData: true,
        hasMaterials: true,
    }, 'withContributors', 'withReviewActions', 'isEmbargo');

    server.create('contributor', { users: currentUser, node: cuban });

    server.createList('registration', 12,
        {
            reviewsState: RegistrationReviewStates.Pending,
            provider: egap,
        });
    server.create('contributor', { node: decaf }, 'unregistered');

    const wdrwn = server.create('registration', {
        id: 'wdrwn',
        title: 'Withdrawn Hermit',
        withdrawn: true,
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Withdrawn,
    }, 'withContributors', 'withReviewActions');
    server.create('contributor', { users: currentUser, node: wdrwn });

    server.create('subscription');

    server.create('registration', {
        id: 'accpt',
        title: 'Acceptember',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider,
        reviewsState: RegistrationReviewStates.Accepted,
        providerSpecificMetadata: [
            { field_name: 'Metadata field 1', field_value: '' },
            { field_name: 'Another Field', field_value: 'Value 2' },
        ],
    }, 'withContributors');

    server.create('registration', {
        id: 'cuban',
        title: 'Embargo',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
    }, 'withContributors', 'isEmbargo');

    const pndwd = server.create('registration', {
        id: 'pndwd',
        title: 'Cold Turkey',
        provider: egap,
        reviewsState: RegistrationReviewStates.PendingWithdraw,
    }, 'withSingleReviewAction');
    server.create('contributor', { users: currentUser, node: pndwd });

    const aerchive = server.create('registration', {
        id: 'aerchive',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider,
    }, 'isArchiving');
    server.create('contributor', { users: currentUser, node: aerchive });

    const draftNode = server.create('draft-node', 'withFiles');
    server.create('draft-registration', {
        id: 'dcaf',
        registrationSchema: server.schema.registrationSchemas.find('open_ended_registration'),
        initiator: currentUser,
        branchedFrom: draftNode,
        hasProject: false,
        license: licenseReqFields,
        currentUserPermissions: Object.values(Permission),
    }, 'withSubjects', 'withAffiliatedInstitutions', 'withContributors');

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

    const clinicalTrials = server.create('external-provider', {
        shareSource: 'ClinicalTrials.gov',
    });
    const researchRegistry = server.create('external-provider', {
        shareSource: 'Research Registry',
    });

    server.createList('external-registration', 3, { provider: clinicalTrials });
    server.createList('external-registration', 2, { provider: researchRegistry });

    server.create('draft-registration', {
        id: 'rrpre',
        registrationSchema: server.schema.registrationSchemas.find('replication_recipe_pre_registration'),
        initiator: currentUser,
        registrationResponses,
        branchedFrom: rootNode,
    });

    server.create('draft-registration', {
        id: 'pregc',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        initiator: currentUser,
        registrationResponses,
        branchedFrom: rootNode,
    });

    server.createList('subject', 10, 'withChildren');

    // Current user Bookmarks collection
    server.create('collection', { title: 'Bookmarks', bookmarks: true });
}

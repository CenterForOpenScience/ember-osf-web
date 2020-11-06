import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-get-config';
import faker from 'faker';

import FileProvider from 'ember-osf-web/models/file-provider';
import { StorageStatus } from 'ember-osf-web/models/node-storage';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { draftRegisterNodeMultiple, forkNode, registerNodeMultiple } from '../helpers';

const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
    mirageScenarios,
    engines: {
        handbook: {
            enabled: handbookEnabled,
        },
    },
} = config;

function registrationScenario(
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

    server.create('registration', { id: 'beefs' });

    const registrationResponses = {
        'page-one_long-text': '',
        'page-one_multi-select': ['Crocs'],
        'page-one_multi-select-other': '',
        'page-one_short-text': 'Ravioli',
        'page-one_single-select-two': 'Remember who was in NSync and who was in Backstreet Boys',
    };

    const rootNode = server.create('node', {
        public: false,
        contributors: server.createList('contributor', 11),
        currentUserPermissions: [Permission.Admin],
    }, 'withFiles', 'withStorage');
    rootNode.update({
        storage: server.create('node-storage', { storageLimitStatus: StorageStatus.OVER_PRIVATE }),
    });

    const childNodeA = server.create('node', { parent: rootNode });
    server.create('node', { parent: childNodeA });
    server.create('node', { parent: childNodeA });
    const licenseReqFields = server.schema.licenses.findBy({ name: 'MIT License' });
    const provider = server.create('registration-provider',
        { id: 'ispor', name: 'ISPOR', allowSubmissions: true },
        'withBrand',
        'withSchemas');

    const egap = server.create('registration-provider', { id: 'egap', name: 'EGAP' }, 'withBrand');
    server.create('moderator', { provider: egap });
    server.create('moderator', { id: currentUser.id, user: currentUser, provider: egap }, 'asAdmin');
    server.createList('moderator', 5, { provider: egap });

    const decaf = server.create('registration', {
        id: 'decaf',
        title: 'Pending Penguins',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Pending,
        registeredBy: currentUser,
        currentUserPermissions: Object.values(Permission),
    }, 'withContributors', 'withReviewActions');

    server.createList('registration', 12,
        {
            reviewsState: RegistrationReviewStates.Pending,
            provider: egap,
        });
    server.create('contributor', { node: decaf }, 'unregistered');

    server.create('registration', {
        id: 'wdrwn',
        title: 'Withdrawn Hermit',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Withdrawn,
    }, 'withContributors', 'withReviewActions');

    // server.create('registration', {
    //     id: 'r3jct',
    //     title: 'Hector the Rejector',
    //     registrationSchema: server.schema.registrationSchemas.find('testSchema'),
    //     provider: egap,
    //     reviewsState: 'rejected',
    // }, 'withContributors');

    server.create('subscription');

    server.create('registration', {
        id: 'accpt',
        title: 'Acceptember',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Accepted,
    }, 'withContributors');

    server.create('registration', {
        id: 'cuban',
        title: 'Embargo',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
    }, 'withContributors', 'isEmbargo');

    server.create('registration', {
        id: 'pndwd',
        title: 'Cold Turkey',
        provider: egap,
        reviewsState: RegistrationReviewStates.PendingWithdraw,
    }, 'withSingleReviewAction');

    server.create('registration', {
        id: 'aerchive',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider,
    }, 'isArchiving');

    server.create('draft-registration', {
        id: 'dcaf',
        registrationSchema: server.schema.registrationSchemas.find('open_ended_registration'),
        initiator: currentUser,
        branchedFrom: rootNode,
        license: licenseReqFields,
    }, 'withSubjects', 'withAffiliatedInstitutions');

    server.create('draft-registration', {
        id: 'brand',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        initiator: currentUser,
        registrationResponses,
        branchedFrom: rootNode,
        license: licenseReqFields,
        provider,
    });

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

function quickfilesScenario(server: Server, currentUser: ModelInstance<User>) {
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

function collectionScenario(server: Server, currentUser: ModelInstance<User>) {
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

function dashboardScenario(server: Server, currentUser: ModelInstance<User>) {
    server.create('user-setting', { user: currentUser });
    const firstNode = server.create('node', 'withAffiliatedInstitutions');
    server.create('contributor', { node: firstNode, users: currentUser, index: 0 });
    const nodes = server.createList('node', 10, {
        currentUserPermissions: Object.values(Permission),
    }, 'withContributors');
    for (const node of nodes) {
        server.create('contributor', {
            node,
            users: currentUser,
            permission: Permission.Admin,
            index: 0,
        });
    }

    server.create('node', {
        id: noteworthyNode,
        linkedNodes: nodes.slice(0, 5),
        title: 'NNW',
        currentUserPermissions: [Permission.Read],
    });
    server.create('node', {
        id: popularNode,
        linkedNodes: nodes.slice(5, 10),
        title: 'Popular',
        currentUserPermissions: [Permission.Read],
    });
    for (const node of nodes.slice(4, 10)) {
        server.create('contributor', { node, users: currentUser, index: 11 });
    }

    // NOTE: Some institutions are already created by this point
    server.createList('institution', 20);
    // Create a specific institution to test institutional dashboard with; should be ID 29 at this point
    server.create('institution', {
        id: 'has-users',
    }, 'withMetrics');
}

function forksScenario(server: Server, currentUser: ModelInstance<User>) {
    const forksNode = server.create('node', { id: 'fork5', currentUserPermissions: Object.values(Permission) });
    server.create('contributor', {
        node: forksNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });
    forkNode(server, forksNode, { currentUserPermissions: Object.values(Permission) });
}

function handbookScenario(server: Server, currentUser: ModelInstance<User>) {
    // ValidatedModelForm
    server.create('node', {
        id: 'extng',
        title: 'Existing node!',
        description: 'Passing in `model=this.node` tells the form to make changes to this model instance directly.',
    });

    // EditableField
    const editable = server.create('registration', {
        id: 'editj',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        currentUserPermissions: Object.values(Permission),
    }, 'withAffiliatedInstitutions');

    server.create('contributor', { users: currentUser, node: editable });

    // ContributorList
    for (const contributorCount of [1, 2, 3, 23]) {
        const node = server.create('node', { id: `clst${contributorCount}` });
        server.createList('contributor', contributorCount, { node });
    }

    // AncestryDisplay
    const parent = server.create('node', { id: 'ezcuj', title: faker.lorem.sentences(6) });
    const child = server.create('node', { parent, id: 'ezcuj1', title: faker.lorem.sentences(5) });
    const grandChild = server.create('node', { parent: child, root: parent, id: 'ezcuj2' });
    server.create('node', { parent: grandChild, root: parent, id: 'ezcuj3' });

    // Files Widget
    const fileWidgetNode = server.create('node',
        { id: 'ogst', currentUserPermissions: Object.values(Permission) }, 'withFiles');

    const folderA = server.create('file', { target: fileWidgetNode }, 'asFolder');

    const fileProviders = fileWidgetNode.files.models as Array<ModelInstance<FileProvider>>;
    const [osfstorage] = fileProviders;
    const providerFiles = osfstorage.rootFolder.files.models;

    osfstorage.rootFolder.update({
        files: [...providerFiles, folderA],
    });

    server.createList('file', 15, { target: fileWidgetNode, parentFolder: folderA });
    const folderB = server.create('file', { target: fileWidgetNode, parentFolder: folderA }, 'asFolder');

    server.createList('file', 2, { target: fileWidgetNode, parentFolder: folderB });
    const folderC = server.create('file', { target: fileWidgetNode, parentFolder: folderB }, 'asFolder');

    server.createList('file', 3, { target: fileWidgetNode, parentFolder: folderC });
    server.create('file', { target: fileWidgetNode, parentFolder: folderC }, 'asFolder');

    // SubjectWidgets
    server.createList('subject', 10, 'withChildren');
    const provider = server.schema.registrationProviders.find('osf');
    provider.update({
        subjects: server.schema.subjects.all().models,
    });
    server.create('registration', { id: 'subj' }, 'withSubjects');

    // SchemaBlock Renderer
    const schemaNode = server.create(
        'node',
        { id: 'dslt', currentUserPermissions: Object.values(Permission) },
        'withFiles',
    );

    const folder = server.create('file', { target: schemaNode }, 'asFolder');
    const providers = fileWidgetNode.files.models as Array<ModelInstance<FileProvider>>;
    const storage = providers[0];
    const providersFiles = storage.rootFolder.files.models;
    storage.update({
        files: [...providersFiles, folder],
    });
    server.createList('file', 15, { target: schemaNode, parentFolder: folder });
    server.createList('contributor', 23, { node: schemaNode });
}

function settingsScenario(server: Server, currentUser: ModelInstance<User>) {
    server.create('user-setting', { user: currentUser });
    server.createList('token', 23);
    server.createList('scope', 5);
    server.createList('developer-app', 12);
    server.create('external-identity', { id: 'ORCID' }, 'withStatusVerified');
    server.createList('external-identity', 10);
}

function meetingsScenario(server: Server) {
    server.create('meeting', {
        id: 'testmeeting',
        name: 'Test Meeting',
        submissions: server.createList('meeting-submission', 15),
    });
    server.createList('meeting', 25);
}

export default function(server: Server) {
    server.loadFixtures('schema-blocks');
    server.loadFixtures('registration-schemas');
    server.loadFixtures('regions');
    server.loadFixtures('preprint-providers');
    server.loadFixtures('licenses');
    // server.loadFixtures('registration-providers');

    const userTraits = !mirageScenarios.includes('loggedIn') ? []
        : [
            'loggedIn',
            'withInstitutions',
            'withSettings',
            'withAlternateEmail',
            'withUnconfirmedEmail',
        ];
    const currentUser = server.create('user', ...userTraits);

    // Optional Scenarios
    if (mirageScenarios.includes('dashboard')) {
        dashboardScenario(server, currentUser);
    }
    if (mirageScenarios.includes('registrations')) {
        registrationScenario(server, currentUser);
    }
    if (mirageScenarios.includes('collections')) {
        collectionScenario(server, currentUser);
    }
    if (mirageScenarios.includes('forks')) {
        forksScenario(server, currentUser);
    }
    if (mirageScenarios.includes('settings')) {
        settingsScenario(server, currentUser);
    }
    if (mirageScenarios.includes('quickfiles')) {
        quickfilesScenario(server, currentUser);
    }
    if (mirageScenarios.includes('meetings')) {
        meetingsScenario(server);
    }
    if (handbookEnabled) {
        handbookScenario(server, currentUser);
    }
}

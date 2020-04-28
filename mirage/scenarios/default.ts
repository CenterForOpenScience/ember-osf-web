import { faker, ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import FileProvider from 'ember-osf-web/models/file-provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

import { draftRegisterNodeMultiple, forkNode, registerNodeMultiple } from '../helpers';
import { placekitten } from '../utils';

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

    const rootNode = server.create('node');
    const childNodeA = server.create('node', { parent: rootNode });
    server.create('node', { parent: childNodeA });
    server.create('node', { parent: childNodeA });
    const licenseReqFields = server.schema.licenses.findBy({ name: 'MIT License' });

    server.create('draft-registration', {
        id: 'dcaf',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        initiator: currentUser,
        registrationResponses,
        branchedFrom: rootNode,
        license: licenseReqFields,
    }, 'withSubjects', 'withAffiliatedInstitutions');

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

    server.create('registration', {
        id: 'decaf',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        linkedNodes: server.createList('node', 2),
        linkedRegistrations: server.createList('registration', 2),
        currentUserPermissions: Object.values(Permission),
    }, 'withContributors', 'withComments', 'withAffiliatedInstitutions');

    server.createList('subject', 10, 'withChildren');

    const provider = server.schema.registrationProviders.find('osf');
    const brand = server.create('brand', {
        id: '1',
        primaryColor: 'green',
        secondaryColor: 'blue',
        navbarLogoImage: placekitten(30, 30),
        heroLogoImage: 'http://somelogoimageurl',
        heroBackgroundImage: placekitten(1350, 900),
    });

    provider.update({
        subjects: server.schema.subjects.all().models,
        brand,
    });

    // Current user Bookmarks collection
    server.create('collection', { title: 'Bookmarks', bookmarks: true });
}

function quickfilesScenario(server: Server, currentUser: ModelInstance<User>) {
    server.createList('file', 5, { user: currentUser });
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
    server.create('institution', { id: 'has-users' }, 'withInstitutionUsers', 'withSummaryMetrics');
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
    server.loadFixtures('registration-providers');

    const userTraits = !mirageScenarios.includes('loggedIn') ? [] :
        [
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

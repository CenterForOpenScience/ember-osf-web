import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { Permission } from 'ember-osf-web/models/osf-model';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import User from 'ember-osf-web/models/user';

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

function registrationScenario(server: Server, currentUser: ModelInstance<User>) {
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

    server.create('registration', {
        id: 'decaf',
        registrationSchema: server.schema.registrationSchemas.find<RegistrationSchema>('prereg_challenge'),
        linkedNodes: server.createList('node', 2),
        linkedRegistrations: server.createList('registration', 2),
        root: undefined,
        currentUserPermissions: Object.values(Permission),
    }, 'withContributors', 'withComments', 'withDoi', 'withLicense');
    // Current user Bookmarks collection
    server.create('collection', { title: 'Bookmarks', bookmarks: true });
}

function quickfilesScenario(server: Server, currentUser: ModelInstance<User>) {
    server.createList('file', 5, { user: currentUser });
}

function dashboardScenario(server: Server, currentUser: ModelInstance<User>) {
    const firstNode = server.create('node', {});
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
    server.createList('institution', 20);
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

function handbookScenario(server: Server) {
    // ValidatedModelForm
    server.create('node', {
        id: 'extng',
        title: 'Existing node!',
        description: 'Passing in `model=this.node` tells the form to make changes to this model instance directly.',
    });

    // ContributorList
    for (const contributorCount of [1, 2, 3, 23]) {
        const node = server.create('node', { id: `clst${contributorCount}` });
        server.createList('contributor', contributorCount, { node });
    }
}

function settingsScenario(server: Server, currentUser: ModelInstance<User>) {
    server.create('user-setting', { user: currentUser });
    server.createList('token', 23);
    server.createList('scope', 5);
    server.createList('developer-app', 12);
}

export default function(server: Server) {
    server.loadFixtures('registration-schemas');
    server.loadFixtures('regions');
    server.loadFixtures('preprint-providers');
    server.loadFixtures('licenses');

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
    if (mirageScenarios.includes('forks')) {
        forksScenario(server, currentUser);
    }
    if (mirageScenarios.includes('settings')) {
        settingsScenario(server, currentUser);
    }
    if (mirageScenarios.includes('quickfiles')) {
        quickfilesScenario(server, currentUser);
    }
    if (handbookEnabled) {
        handbookScenario(server);
    }
}

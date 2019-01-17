import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

import { draftRegisterNodeMultiple, forkNode, registerNodeMultiple } from '../helpers';

const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
    'ember-cli-mirage': {
        defaultLoggedOut,
    },
} = config;

export default function(server: Server) {
    const userTraits = defaultLoggedOut ? [] : ['loggedIn', 'withInstitutions'];
    const currentUser = server.create('user', ...userTraits);

    server.create('user-setting', { user: currentUser });
    const registrationNode = server.create('node', { id: 'regis', currentUserPermissions: Object.values(Permission) });
    server.create('contributor', {
        node: registrationNode,
        users: currentUser,
        permission: 'admin',
        index: 0,
    });
    const forksNode = server.create('node', { id: 'fork5', currentUserPermissions: Object.values(Permission) });
    server.create('contributor', {
        node: forksNode,
        users: currentUser,
        permission: 'admin',
        index: 0,
    });

    const nodeManyContribs = server.create('registration', { id: 'contr' });
    server.create('contributor', { node: nodeManyContribs, users: currentUser });
    server.createList('contributor', 67, { node: nodeManyContribs });

    const nodes = server.createList<Node>('node', 10, {
        currentUserPermissions: Object.values(Permission),
    }, 'withContributors');
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
    server.createList('token', 23);
    server.createList('scope', 5);
    server.createList('developer-app', 12);
    server.loadFixtures('registration-schemas');
    server.loadFixtures('regions');

    forkNode(server, forksNode as ModelInstance<Node>, { currentUserPermissions: Object.values(Permission) });
    registerNodeMultiple(server, registrationNode as ModelInstance<Node>, 12, {
        currentUserPermissions: Object.values(Permission),
    });
    draftRegisterNodeMultiple(server, registrationNode as ModelInstance<Node>, 12, {}, 'withRegistrationMetadata');

    server.create('registration', { id: 'beefs' });

    const reg = server.create('registration', {
        id: 'decaf',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        linkedNodes: server.createList('node', 21),
        linkedRegistrations: server.createList('registration', 19),
    }, 'withContributors');
    server.createList('registration', 15, { parent: reg });

    const reg2 = server.create('registration', {
        id: 'recaf',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        linkedNodes: server.createList('node', 2),
        linkedRegistrations: server.createList('registration', 3),
    }, 'withContributors');
    server.createList('registration', 2, { parent: reg2 });

    server.loadFixtures('preprint-providers');

    // For the handbook

    // ValidatedModelForm
    server.create('node', {
        id: 'extng',
        title: 'Existing node!',
        description: 'Passing in `model=this.node` tells the form to make changes to this model instance directly.',
    });
}

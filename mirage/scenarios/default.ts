import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

import { draftRegisterNodeMultiple, registerNodeMultiple } from '../helpers';

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
    let currentUser = null;

    if (defaultLoggedOut) {
        currentUser = server.create('user');
        server.create('root', { currentUser: null });
    } else {
        currentUser = server.create('user', 'loggedIn');
    }
    server.create('user-settings', { user: currentUser });
    const firstNode = server.create('node', {});
    server.create('contributor', { node: firstNode, users: currentUser, index: 0 });
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

    registerNodeMultiple(server, nodes[0], 12, {
        currentUserPermissions: Object.values(Permission),
    }, 'withRegisteredMeta');
    draftRegisterNodeMultiple(server, nodes[0], 12, {}, 'withRegistrationMetadata');

    server.create('registration', { id: 'beefs' });

    const reg = server.create('registration', {
        id: 'decaf',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        linkedNodes: server.createList('node', 21),
        linkedRegistrations: server.createList('registration', 19),
    }, 'withRegisteredMeta', 'withContributors');
    server.createList('registration', 15, { parent: reg });

    const reg2 = server.create('registration', {
        id: 'recaf',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        linkedNodes: server.createList('node', 2),
        linkedRegistrations: server.createList('registration', 3),
    }, 'withRegisteredMeta', 'withContributors');
    server.createList('registration', 2, { parent: reg2 });

    // For the handbook

    // ValidatedModelForm
    server.create('node', {
        id: 'extng',
        title: 'Existing node!',
        description: 'Passing in `model=this.node` tells the form to make changes to this model instance directly.',
    });
}

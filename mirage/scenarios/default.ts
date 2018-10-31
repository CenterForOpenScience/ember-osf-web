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
} = config;

export default function(server: Server) {
    const currentUser = server.create('user', 'loggedIn');
    const firstNode = server.create('node', {});
    server.create('contributor', { node: firstNode, users: currentUser, bibliographic: true });

    const nodeManyContribs = server.create('node', { id: 'x2pqs' });
    server.create('contributor', { node: nodeManyContribs, users: currentUser, bibliographic: true });
    server.createList('contributor', 2, { node: nodeManyContribs, bibliographic: true });
    server.createList('contributor', 3, { node: nodeManyContribs, bibliographic: false });

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
    server.create('registration', {
        id: 'decaf',
    });
}

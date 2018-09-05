import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Node from 'ember-osf-web/models/node';

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
    server.create('contributor', { node: firstNode, users: currentUser, index: 0 });
    const nodes = server.createList<Node>('node', 10, {}, 'withContributors');
    server.create('node', {
        id: noteworthyNode,
        linkedNodes: nodes.slice(0, 5),
        title: 'NNW',
    });
    server.create('node', {
        id: popularNode,
        linkedNodes: nodes.slice(5, 10),
        title: 'Popular',
    });
    for (const node of nodes.slice(4, 10)) {
        server.create('contributor', { node, users: currentUser, index: 11 });
    }
    server.createList('institution', 20);
    server.createList('token', 7);
    server.loadFixtures('registration-schemas');
    registerNodeMultiple(server, nodes[0], 12, {}, 'withRegisteredMeta');
    draftRegisterNodeMultiple(server, nodes[0], 12, {}, 'withRegistrationMetadata');
}

export default function (server) {
    const currentUser = server.create('user');
    const firstNode = server.create('node', {});
    server.create('contributor', { node: firstNode, users: currentUser, index: 0 });
    const nodes = server.createList('node', 10, {}, 'withContributors');
    server.create('node', {
        id: 'z3sg2',
        linkedNodeIds: ['node1', 'node2', 'node3', 'node4', 'node5'],
        title: 'NNW',
    });
    server.create('node', {
        id: '57tnq',
        linkedNodeIds: ['node6', 'node7', 'node8', 'node9', 'nod10'],
        title: 'Popular',
    });
    for (let i = 4; i < 10; i++) {
        server.create('contributor', { node: nodes[i], users: currentUser, index: 11 });
    }
    server.create('root', { currentUser });
    server.createList('institution', 20);
}

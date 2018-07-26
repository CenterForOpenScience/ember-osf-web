export default function (server) {
    const currentUser = server.create('user');
    const firstNode = server.create('node', {});
    server.create('contributor', { node: firstNode, users: currentUser, index: 0 });
    const nodes = server.createList('node', 10, {}, 'withContributors');
    server.loadFixtures('nodes');
    for (let i = 4; i < 10; i++) {
        server.create('contributor', { node: nodes[i], users: currentUser, index: 11 });
    }
    server.create('root', { currentUser });
    server.createList('institution', 20);
}

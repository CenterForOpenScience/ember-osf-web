import { run } from '@ember/runloop';
import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | osf-model', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('osf-model'));
        assert.ok(!!model);
    });

    test('queryHasMany works', async function(assert) {
        const server = startMirage();
        const store = this.owner.lookup('service:store');
        const userId = '1';

        await run(async () => {
            const userOne = server.create('user');
            const nodeList = server.createList('node', 3, {});
            for (let i = 0; i < 3; i++) {
                server.create('contributor', { node: nodeList[i], users: userOne });
            }
            const user = await store.findRecord('user', userId);
            assert.ok(!!user);
            assert.equal(user.get('id'), userId, 'Checking user id.');

            const nodeIds = ['1', '2', '3'];

            const nodes = await user.queryHasMany('nodes');

            assert.equal(nodes.length, nodeIds.length);
            for (const node of nodes) {
                assert.ok((nodeIds.indexOf(node.id) !== -1),
                    `All the node ids should be in the array, but ${node.id} isn't in nodeIds.`);
            }
        });

        server.shutdown();
    });
});

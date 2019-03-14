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
            const userOne = server.create('user', { id: userId });
            const nodeList = server.createList('node', 3, {});
            for (const node of nodeList) {
                server.create('contributor', { node, users: userOne });
            }
            const user = await store.findRecord('user', userId);
            assert.ok(!!user);
            assert.equal(user.get('id'), userId, 'Checking user id.');
            const nodeIds = nodeList.map((node: any) => node.id);

            const nodes = await user.queryHasMany('nodes');

            assert.equal(nodes.length, nodeIds.length);
            assert.notEqual(nodes.length, 0);
            for (const node of nodes) {
                assert.ok((nodeIds.indexOf(node.id) !== -1),
                    `All the node ids should be in the array, but ${node.id} isn't in nodeIds.`);
            }
        });

        server.shutdown();
    });

    test('createM2MRelationship/deleteM2MRelationship works', async function(assert) {
        const server = startMirage();
        const store = this.owner.lookup('service:store');

        await run(async () => {
            const userOne = server.create('user');
            const registrationOne = server.create('registration');
            const institutionOne = server.create('institution', { users: [userOne] });

            server.create('contributor', { node: registrationOne, users: userOne });

            const user = await store.findRecord('user', userOne.id, { include: 'institutions' });
            const registration = await store.findRecord('registration', registrationOne.id);
            const institution = user.institutions.toArray()[0];

            let response: {data: Array<{id: string, type: string}>};
            response = await registration.createM2MRelationship(
                'affiliatedInstitutions',
                institution,
            );
            assert.ok(response.data.findBy('id', institutionOne.id), 'createM2MRelationship works');

            response = await registration.deleteM2MRelationship(
                'affiliatedInstitutions',
                institution,
            );
            assert.notOk(response.data.findBy('id', institutionOne.id), 'deleteM2MRelationship works');
        });

        server.shutdown();
    });
});

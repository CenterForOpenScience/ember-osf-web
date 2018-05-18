import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';

module('Unit | Model | osf model', function(hooks) {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('osf-model'));
        assert.ok(!!model);
    });

    test('queryHasMany works', async function(assert) {
        const server = startMirage();
        const store = this.owner.lookup('service:store');
        const userId = 'guid1';

        await run(async function() {
            const user = await store.findRecord('user', userId);
            assert.ok(!!user);
            assert.equal(user.get('id'), userId);

            const queryParams = { param: 7 };

            const nodeIds = ['guid2', 'guid3', 'guid4'];

            const nodes = await user.queryHasMany('nodes', queryParams);

            assert.equal(nodes.length, nodeIds.length);
            for (let i = 0; i < nodes.length; i++) {
                assert.equal(nodes[i].get('id'), nodeIds[i]);
            }
        });

        server.shutdown();
    });
});

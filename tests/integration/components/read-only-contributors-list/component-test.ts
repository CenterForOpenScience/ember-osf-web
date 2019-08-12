import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | read-only-contributors-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const node = server.create('node');
        const users = server.createList('user', 4);
        for (const user of users) {
            server.create('contributor', { node, users: user });
        }
        const nodeWithContribs = await this.store.findRecord('node', node.id);
        this.set('node', nodeWithContribs);

        await render(hbs`<Registries::ReadOnlyContributorsList @node={{this.node}} />`);

        assert.dom('[data-test-contributor-name]').exists({ count: 4 });

        assert.ok('[data-test-edit-contributors-link]');
    });
});

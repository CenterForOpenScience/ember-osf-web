import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import I18N from 'ember-i18n/services/i18n';

import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import CurrentUser from 'ember-osf-web/services/current-user';

interface ThisTestContext extends TestContext {
    i18n: I18N;
    currentUser: CurrentUser;
}

module('Integration | Component | read-only-contributor-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders 991', async function(assert) {
        const node = server.create('node');
        const users = server.createList('user', 4);
        for (const user of users) {
            server.create('contributor', { node, users: user });
        }
        const nodeWithContribs = await this.store.findRecord('node', node.id);
        this.set('node', nodeWithContribs);

        await render(hbs`<Registries::ReadOnlyContributorsList @node={{this.node}} />`);

        assert.dom('a[data-test-contributor-name]').exists({ count: 3 });

        assert.ok('[data-test-edit-contributors-link]');
    });
});

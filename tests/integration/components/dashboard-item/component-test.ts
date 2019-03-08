import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | dashboard-item', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders', async function(assert) {
        const node = server.create('node', {}, 'withContributors');
        const project = await this.store.findRecord('node', node.id, { include: 'bibliographic_contributors' });

        this.set('node', project);
        await render(hbs`<DashboardItem @node={{this.node}} />`);
        assert.dom('[data-test-dashboard-item-title]').exists();
        assert.dom('[data-test-dashboard-item-title]').containsText(project.title, 'Title is set properly');
        assert.dom(`a[href*="${project.links.html}"]`).exists('Link goes to the node\'s html link');
    });
});

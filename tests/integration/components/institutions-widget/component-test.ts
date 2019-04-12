import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import DS from 'ember-data';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

interface ThisTestContext extends TestContext {
    store: DS.Store;
}

module('Integration | Component | institutions-widget', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders', async function(assert) {
        const mirageNode = server.create('node');

        this.set('node', this.store.findRecord('node', mirageNode.id));

        await render(hbs`<InstitutionsWidget @node={{this.node}} />`);

        assert.dom('[data-test-institutions-widget]').exists();
        assert.dom('[data-test-institutions-list-institution]').doesNotExist();
    });

    test('read-only', async function(assert) {
        const mirageNode = server.create('node');

        this.set('node', this.store.findRecord('node', mirageNode.id));

        await render(hbs`<InstitutionsWidget @node={{this.node}} @readOnly=true />`);

        assert.dom('[data-test-institutions-widget]').exists();
        assert.dom('[data-test-add-institution-button]').doesNotExist();
    });

    test('it renders with institutions', async function(assert) {
        const mirageNode = server.create('node');

        const institutions = server.createList('institution', 3, { nodes: [mirageNode] });

        this.set('node', this.store.findRecord('node', mirageNode.id));

        await render(hbs`<InstitutionsWidget @node={{this.node}} />`);

        assert.dom('[data-test-institutions-widget]').exists();
        institutions.forEach(institution =>
            assert.dom(`[data-test-institution-list-institution="${institution.name}"]`).exists());
    });
});

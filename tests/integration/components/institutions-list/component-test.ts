import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import DS from 'ember-data';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

interface ThisTestContext extends TestContext {
    store: DS.Store;
}

module('Integration | Component | institutions-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('no institutions', async function(assert) {
        const mirageNode = server.create('node');

        this.set('node', this.store.findRecord('node', mirageNode.id));

        await render(hbs`<InstitutionsList @node={{this.node}} />`);

        assert.dom('[data-test-institutions-list]').exists();
        assert.dom('[data-test-institutions-list-institution]').doesNotExist();
    });

    test('many institutions', async function(assert) {
        const mirageNode = server.create('node');

        server.createList('institution', 10, { nodes: [mirageNode] });

        this.set('node', this.store.findRecord('node', mirageNode.id));

        await render(hbs`<InstitutionsList @node={{this.node}} />`);

        assert.dom('[data-test-institutions-list]').exists();
        assert.dom('[data-test-institution-list-institution]').exists({ count: 10 });
    });

    test('paginated institutions', async function(assert) {
        const mirageNode = server.create('node');

        server.createList('institution', 15, { nodes: [mirageNode] });

        this.set('node', this.store.findRecord('node', mirageNode.id));

        await render(hbs`<InstitutionsList @node={{this.node}} />`);

        assert.dom('[data-test-institutions-list]').exists();
        assert.dom('[data-test-institution-list-institution]').exists({ count: 10 });

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-institution-list-institution]').exists({ count: 5 });
    });
});

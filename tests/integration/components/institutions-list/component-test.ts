import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import DS from 'ember-data';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';

interface ThisTestContext extends TestContext {
    store: DS.Store;
    manager: {
        node?: Node;
        user: User;
        toggleInstitution: () => void;
        affiliatedList?: Institution[];
    };
    mirageNode: ModelInstance<Node>;
}

const noop = () => { /* noop */ };

module('Integration | Component | institutions-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');

        const mirageUser = server.create('user', 'withInstitutions');
        const user = this.store.findRecord('user', mirageUser.id);

        const mirageNode = server.create('node');
        const node = this.store.findRecord('node', mirageNode.id);

        const managerStub = {
            toggleInstitution: noop,
            affiliatedList: [] as Institution[],
            node,
            user,
        };
        this.manager = managerStub;
        this.mirageNode = mirageNode;

        this.set('manager', managerStub);
    });

    test('no institutions', async assert => {
        await render(hbs`<InstitutionsList @manager={{this.manager}} />`);

        assert.dom('[data-test-institutions-list]').exists();
        assert.dom('[data-test-institutions-list-institution]').doesNotExist();
    });

    test('many institutions', async function(this: ThisTestContext, assert) {
        server.createList('institution', 10, { nodes: [this.mirageNode] });

        await render(hbs`<InstitutionsList @manager={{this.manager}} />`);

        assert.dom('[data-test-institutions-list]').exists();
        assert.dom('[data-test-institution-list-institution]').exists({ count: 10 });
    });

    test('paginated institutions', async function(this: ThisTestContext, assert) {
        server.createList('institution', 15, { nodes: [this.mirageNode] });

        await render(hbs`<InstitutionsList @manager={{this.manager}} />`);

        assert.dom('[data-test-institutions-list]').exists();
        assert.dom('[data-test-institution-list-institution]').exists({ count: 10 });

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-institution-list-institution]').exists({ count: 5 });
    });
});

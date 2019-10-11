import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { task } from 'ember-concurrency';
import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | routes | institutions | dashboard | -components | institutional-users-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('it renders and paginates', async function(assert) {
        server.create('institution', { id: 'testinstitution' }, 'withInstitutionalUsers', 'withStatSummary');

        this.set('modelTask', task(function *(this: TestContext, institutionId: string) {
            return yield this.get('store').findRecord('institution', institutionId);
        }));

        const model = {
            taskInstance: this.get('modelTask').perform('testinstitution'),
        };

        this.set('model', model);
        await render(hbs`<Institutions::Dashboard::-Components::InstitutionalUsersList @model={{this.model}} />`);

        assert.dom('[data-test-header-name]')
            .exists({ count: 1 }, '1 name header');
        assert.dom('[data-test-header-department]')
            .exists({ count: 1 }, '1 departments header');
        assert.dom('[data-test-header-public-projects]')
            .exists({ count: 1 }, '1 public projects header');
        assert.dom('[data-test-header-private-projects]')
            .exists({ count: 1 }, '1 private projects header');

        assert.dom('[data-test-item-name]')
            .exists({ count: 10 }, '10 in the list with a name');
        assert.dom('[data-test-item-department]')
            .exists({ count: 10 }, '10 in the list with department');
        assert.dom('[data-test-item-public-projects]')
            .exists({ count: 10 }, '10 in the list with public project');
        assert.dom('[data-test-item-private-projects]')
            .exists({ count: 10 }, '10 in the list with private projects');

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-item-name]')
            .exists({ count: 5 }, '5 in the list with a name');
        assert.dom('[data-test-item-department]')
            .exists({ count: 5 }, '5 in the list with department');
        assert.dom('[data-test-item-public-projects]')
            .exists({ count: 5 }, '5 in the list with public project');
        assert.dom('[data-test-item-private-projects]')
            .exists({ count: 5 }, '5 in the list with private projects');
    });

    test('it sorts', async function(assert) {
        server.create('institution', { id: 'test' }, 'withInstitutionalUsers', 'withStatSummary');
        const model = { taskInstance: this.store.findRecord('institution', 'test') };
        this.set('model', model);
        await render(hbs`<Institutions::Dashboard::-Components::InstitutionalUsersList @model={{this.model}} />`);

        assert.dom('[data-test-item-name]')
            .exists({ count: 10 }, '10 users');

        await click('[data-test-ascending-sort="department"]');
        assert.dom('[data-test-item-department]')
            .hasText('Architecture', 'Sorts by department ascendening');

        await click('[data-test-descending-sort="department"]');
        assert.dom('[data-test-item-department]')
            .hasText('Psychology', 'Sorts by department descendening');
    });
});

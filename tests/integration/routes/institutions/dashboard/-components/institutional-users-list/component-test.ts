import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | routes | institutions | dashboard | -components | institutional-users-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('it renders and paginates', async function(assert) {
        server.create('institution', {
            id: 'testinstitution',
        }, 'withMetrics');
        const institution = await this.get('store').findRecord('institution', 'testinstitution');
        const departmentMetrics = await institution.get('departmentMetrics');
        const { userMetrics } = institution;
        const model = {
            taskInstance: {
                institution,
                departmentMetrics,
                userMetrics,
            },
        };

        this.set('model', model);
        await render(hbs`
            <Institutions::Dashboard::-Components::InstitutionalUsersList
                @modelTaskInstance={{this.model.taskInstance}}
                @institution={{this.model.taskInstance.institution}}
            />
        `);
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
        const mirageInstitution = server.create('institution', {
            id: 'testinstitution',
        }, 'withMetrics');
        const userMetrics = [
            server.create('institution-user', {
                userName: 'John Doe',
                userGuid: 'abcd',
                department: 'Psychology',
            }),
            server.create('institution-user', {
                userName: 'Jane Doe',
                userGuid: 'abcd',
                department: 'Architecture',
            }),
            server.create('institution-user', {
                userName: 'Hulk Hogan',
                userGuid: 'abcd',
                department: 'Biology',
            }),
        ];
        mirageInstitution.update({ userMetrics });
        const institution = await this.get('store').findRecord('institution', 'testinstitution');
        const departmentMetrics = await institution.get('departmentMetrics');
        const model = {
            taskInstance: {
                institution,
                departmentMetrics,
            },
        };

        this.set('model', model);
        await render(hbs`
            <Institutions::Dashboard::-Components::InstitutionalUsersList
                @modelTaskInstance={{this.model.taskInstance}}
                @institution={{this.model.taskInstance.institution}}
            />
        `);
        assert.dom('[data-test-item-name]')
            .exists({ count: 3 }, '3 users');

        await click('[data-test-ascending-sort="user_name"]');
        assert.dom('[data-test-item-name]')
            .containsText('Hulk Hogan', 'Sorts by name ascendening');

        await click('[data-test-descending-sort="user_name"]');
        assert.dom('[data-test-item-name]')
            .containsText('John Doe', 'Sorts by name descendening');

        await click('[data-test-ascending-sort="department"]');
        assert.dom('[data-test-item-department]')
            .hasText('Architecture', 'Sorts by department ascendening');

        await click('[data-test-descending-sort="department"]');
        assert.dom('[data-test-item-department]')
            .hasText('Psychology', 'Sorts by department descendening');
    });
});

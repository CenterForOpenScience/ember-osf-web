import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | routes | institutions | dashboard | -components | institutional-users-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('it renders and paginates 9 default columns', async function(assert) {
        server.create('institution', {
            id: 'testinstitution',
        }, 'withMetrics');
        const institution = await this.store.findRecord('institution', 'testinstitution');
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
        assert.dom('[data-test-header]')
            .exists({ count: 9 }, '9 default headers');
        assert.dom('[data-test-header="department"]')
            .exists({ count: 1 }, '1 departments header');
        assert.dom('[data-test-header="orcid"]')
            .exists('1 orcid header');
        assert.dom('[data-test-header="publicProjects"]')
            .exists({ count: 1 }, '1 public projects header');
        assert.dom('[data-test-header="privateProjects"]')
            .exists({ count: 1 }, '1 private projects header');

        assert.dom('[data-test-item]')
            .exists({ count: 90 }, '90 items 10 rows and 9 columns by default');
        assert.dom('[data-test-item="department"]')
            .exists({ count: 10 }, '10 in the list with department');
        assert.dom('[data-test-item="publicProjects"]')
            .exists({ count: 10 }, '10 in the list with public project');
        assert.dom('[data-test-item="privateProjects"]')
            .exists({ count: 10 }, '10 in the list with private projects');

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-item="user_name"]')
            .exists({ count: 5 }, '5 in the list with a name');
        assert.dom('[data-test-item="department"]')
            .exists({ count: 5 }, '5 in the list with department');
        assert.dom('[data-test-item="publicProjects"]')
            .exists({ count: 5 }, '5 in the list with public project');
        assert.dom('[data-test-item="privateProjects"]')
            .exists({ count: 5 }, '5 in the list with private projects');

        // Test download buttons
        await click('[data-test-download-dropdown]');
        assert.dom('[data-test-csv-download-button]').exists('CSV download button');
        assert.dom('[data-test-tsv-download-button]').exists('TSV download button');
        assert.dom('[data-test-json-download-button]').exists('JSON download button');
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
        const institution = await this.store.findRecord('institution', 'testinstitution');
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
        assert.dom('[data-test-item="user_name"]')
            .exists({ count: 3 }, '3 users');

        assert.dom('[data-test-item="user_name"]')
            .containsText('Hulk Hogan', 'Sorts by name ascending by default');

        assert.dom('[data-test-item] a:first-of-type')
            .hasAttribute('href');

        await click('[data-test-sort="user_name"]');
        assert.dom('[data-test-item]')
            .containsText('John Doe', 'Sorts by name descending');

        await click('[data-test-sort="department"]');
        assert.dom('[data-test-item="department"]')
            .hasText('Psychology', 'Sorts by department descending');

        await click('[data-test-sort="department"]');
        assert.dom('[data-test-item="department"]')
            .hasText('Architecture', 'Sorts by department ascending');

    });
});

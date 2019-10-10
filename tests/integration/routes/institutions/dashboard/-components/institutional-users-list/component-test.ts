import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { OsfLinkRouterStub } from '../../../../../helpers/osf-link-router-stub';

module('Integration | routes | institutions | dashboard | -components | institutional-users-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('it renders and paginates', async assert => {
        server.create('institution', { id: 'has-users' }, 'withInstitutionalUsers', 'withStatSummary');

        await render(hbs`<Institutions::Dashboard::-Components::InstitutionalUsersList />`);

        assert.dom('[data-test-institutional-users-list-header-name]')
            .exists({ count: 1 }, '1 name header');
    });

    test('it sorts', async assert => {
        server.create('institution', { id: 'has-users' }, 'withInstitutionalUsers', 'withStatSummary');

        await render(hbs`<Institutions::Dashboard::-Components::InstitutionalUsersList />`);

        assert.dom('[data-test-institutional-users-list-item-name]')
            .exists({ count: 10 }, '10 users');

        await click('[data-test-ascending-sort="name"]');
        assert.dom('[data-test-institutional-users-list-item-name]')
            .hasText('Lafayette Rice', 'Sorts by name ascending');

        await click('[data-test-descending-sort="name"]');
        assert.dom('[data-test-institutional-users-list-item-name]')
            .hasText('Lafayette Rice', 'Sorts by name descending');

        await click('[data-test-ascending-sort="department"]');
        assert.dom('[data-test-institutional-users-list-item-department]')
            .hasText('Architecture', 'Sorts by department ascendening');

        await click('[data-test-descending-sort="department"]');
        assert.dom('[data-test-institutional-users-list-item-department]')
            .hasText('Psychology', 'Sorts by department descendening');
    });
});

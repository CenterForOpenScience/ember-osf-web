import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | my-registrations-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('draft list empty', async function(this: TestContext, assert) {
        await render(
            hbs`<Registries::MyRegistrationsList::Drafts />`,
        );
        assert.dom('[data-test-draft-list-no-general]').hasText(
            this.intl.t('registries.myRegistrationsList.noGeneral'),
            'No items general message exists and correct',
        );
        assert.dom('[data-test-draft-list-no-drafts]').hasText(
            this.intl.t('registries.myRegistrationsList.noDrafts'),
            'Specifc no drafts message exists and correct',
        );
        assert.dom('[data-test-add-new-button]').exists('Add new button exists');
    });

    test('registration list empty', async function(this: TestContext, assert) {
        const currentUser = server.create('user', { id: 'wraith' });
        const currentUserModel = await this.store.findRecord('user', currentUser.id);
        this.set('user', currentUserModel);
        this.owner.lookup('service:current-user').setProperties({
            user: currentUserModel, currentUserId: currentUserModel.id,
        });
        await render(
            hbs`<Registries::MyRegistrationsList::Registrations @user={{this.user}} />`,
        );
        assert.dom('[data-test-draft-list-no-general]').hasText(
            this.intl.t('registries.myRegistrationsList.noGeneral'),
            'No items general message exists and correct',
        );
        assert.dom('[data-test-draft-list-no-registrations]').hasText(
            this.intl.t('registries.myRegistrationsList.noRegistrations'),
            'Specifc no registrations message exists and correct',
        );
        assert.dom('[data-test-add-new-button]').exists('Add new button exists');
    });

    test('draft list renders and paginates', async function(this: TestContext, assert) {
        const currentUser = server.create('user', { id: 'wraith' });
        const currentUserModel = await this.store.findRecord('user', currentUser.id);
        this.owner.lookup('service:current-user').setProperties({
            user: currentUserModel, currentUserId: currentUserModel.id,
        });
        server.createList('draft-registration', 11, { initiator: currentUser });
        await render(
            hbs`<Registries::MyRegistrationsList::Drafts />`,
        );
        assert.dom('[data-test-draft-registration-card]').exists({ count: 10 }, 'First page shows 10 results');
        assert.dom('[data-test-next-page-button]').isEnabled('Next page exists');
        await click('[data-test-next-page-button]');
        assert.dom('[data-test-draft-registration-card]').exists({ count: 1 }, 'Second page shows 1 results');
        assert.dom('[data-test-next-page-button]').isDisabled('There is no next page');
    });

    test('registrations list renders and paginates', async function(this: TestContext, assert) {
        const currentUser = server.create('user', { id: 'wraith' });
        const currentUserModel = await this.store.findRecord('user', currentUser.id);
        this.set('user', currentUserModel);
        this.owner.lookup('service:current-user').setProperties({
            user: currentUserModel, currentUserId: currentUserModel.id,
        });
        for (let i = 0; i < 11; i++) {
            server.create('registration', {
                contributors: [
                    server.create('contributor', { users: currentUser }),
                ],
            });
        }
        await render(
            hbs`<Registries::MyRegistrationsList::Registrations @user={{this.user}} />`,
        );
        assert.dom('[data-test-node-card]').exists({ count: 10 }, 'First page shows 10 results');
        assert.dom('[data-test-next-page-button]').isEnabled('Next page exists');
        await click('[data-test-next-page-button]');
        assert.dom('[data-test-node-card]').exists({ count: 1 }, 'Second page shows 1 results');
        assert.dom('[data-test-next-page-button]').isDisabled('There is no next page');
    });
});

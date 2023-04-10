import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import { PermissionGroup } from 'ember-osf-web/models/moderator';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

interface ModeratorsTestContext extends TestContext {
    provider: ModelInstance<RegistrationProviderModel>;
}

module('Integration | Component | moderators', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: ModeratorsTestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        this.owner.register('service:current-user', CurrentUserStub);
        this.provider = server.create('registration-provider', { id: 'egap', name: 'EGAP' });
        const providerModel = await this.store.findRecord('registration-provider', 'egap');
        this.set('providerModel', providerModel);
    });

    test('it renders and pagination works', async function(this: ModeratorsTestContext, assert) {
        const moderators = server.createList('moderator', 18);
        this.provider.update({
            moderators: [...moderators],
        });
        await render(
            hbs`<Moderators::Manager
                    @provider={{this.providerModel}}
                    as |moderatorManager|
                >
                    <Moderators::List
                        @manager={{moderatorManager}}
                    />
                </Moderators::Manager>`,
        );
        assert.dom('[data-test-moderator-link]').exists({ count: 10 });
        assert.dom('[data-test-permission-group]').exists({ count: 10 });
        await click('[data-test-next-page-button]');
        assert.dom('[data-test-moderator-link]').exists({ count: 8 });
        assert.dom('[data-test-permission-group]').exists({ count: 8 });
    });

    test('can update user permission and remove moderator as an admin', async function(
        this: ModeratorsTestContext, assert,
    ) {
        const currentUser = server.create('user', { id: 'sprout' });
        const currentUserModel = await this.store.findRecord('user', 'sprout');
        this.owner.lookup('service:current-user').setProperties({
            testUser: currentUserModel, currentUserId: currentUserModel.id,
        });
        const moderator = server.create('moderator', {
            permissionGroup: PermissionGroup.Moderator,
            provider: this.provider,
        });
        server.create('moderator', {
            id: currentUserModel.id,
            user: currentUser,
            provider: this.provider,
        }, 'asAdmin');
        await render(
            hbs`<Moderators::Manager
                    @provider={{this.providerModel}}
                    as |moderatorManager|
                >
                    <Moderators::List
                        @manager={{moderatorManager}}
                    />
                </Moderators::Manager>`,
        );
        assert.dom('[data-test-moderator-link]').exists({ count: 2 });
        assert.dom('[data-test-permission-group]').exists({ count: 2 });
        assert.dom('[data-test-delete-moderator-button]').exists({ count: 2 });
        assert.dom(`[data-test-moderator-row="${currentUser.id}"]>div>[data-test-permission-group]`).hasText('Admin');
        assert.dom(`[data-test-moderator-row="${moderator.id}"]>div>[data-test-permission-group]`).hasText('Moderator');
        await clickTrigger(`[data-test-moderator-row="${moderator.id}"]`);
        await selectChoose(`[data-test-moderator-row="${moderator.id}"]`, 'Admin');
        assert.dom(`[data-test-moderator-row="${currentUser.id}"]>div>[data-test-permission-group]`).hasText('Admin');
        assert.dom(`[data-test-moderator-row="${moderator.id}"]>div>[data-test-permission-group]`).hasText('Admin');
        await click(`[data-test-delete-moderator-button="${moderator.id}"]>[data-test-delete-button]`);
        assert.dom('[data-test-delete-modal-body]').hasText(
            this.intl.t('osf-components.moderators.remove.modal.body', { moderator: moderator.fullName }),
        );
        await click('[data-test-confirm-delete]');
        assert.dom('[data-test-moderator-link]').exists({ count: 1 });
        assert.dom('[data-test-permission-group]').exists({ count: 1 });
        assert.dom('[data-test-delete-moderator-button]').exists({ count: 1 });
    });

    test('can only remove self as a moderator', async function(
        this: ModeratorsTestContext, assert,
    ) {
        const currentUser = server.create('user', { id: 'sprout' });
        const currentUserModel = await this.store.findRecord('user', 'sprout');
        this.owner.lookup('service:current-user').setProperties({
            testUser: currentUserModel, currentUserId: currentUserModel.id,
        });
        const admin = server.create('moderator', {
            permissionGroup: PermissionGroup.Admin,
            provider: this.provider,
        });
        const moderator = server.create('moderator', {
            id: currentUserModel.id,
            user: currentUser,
            provider: this.provider,
        });
        await render(
            hbs`<Moderators::Manager
                    @provider={{this.providerModel}}
                    as |moderatorManager|
                >
                    <Moderators::List
                        @manager={{moderatorManager}}
                    />
                </Moderators::Manager>`,
        );
        assert.dom('[data-test-add-moderator-button').doesNotExist();
        assert.dom('[data-test-moderator-link]').exists({ count: 2 });
        assert.dom('[data-test-permission-group]').exists({ count: 2 });
        assert.dom('[data-test-delete-moderator-button]').exists({ count: 1 });
        assert.dom(`[data-test-delete-moderator-button="${admin.id}"]`).doesNotExist();
        assert.dom(
            `[data-test-moderator-row="${currentUser.id}"]>div>[data-test-permission-group]`,
        ).hasText('Moderator');
        assert.dom(`[data-test-moderator-row="${admin.id}"]>div>[data-test-permission-group]`).hasText('Admin');
        await click(`[data-test-delete-moderator-button="${moderator.id}"]>[data-test-delete-button]`);
        assert.dom('[data-test-delete-modal-body]').hasText(
            this.intl.t('osf-components.moderators.remove.modal.body', { moderator: 'yourself' }),
        );
        await click('[data-test-confirm-delete]');
        assert.dom('[data-test-moderator-link]').exists({ count: 1 });
        assert.dom('[data-test-permission-group]').exists({ count: 1 });
        assert.dom('[data-test-delete-moderator-button]').doesNotExist();
    });

    test('can add moderator by searching for user', async function(
        this: ModeratorsTestContext, assert,
    ) {
        const currentUser = server.create('user', { id: 'sprout' });
        const currentUserModel = await this.store.findRecord('user', 'sprout');
        this.owner.lookup('service:current-user').setProperties({
            testUser: currentUserModel, currentUserId: currentUserModel.id,
        });
        server.create('moderator', {
            id: currentUserModel.id,
            user: currentUser,
            provider: this.provider,
        }, 'asAdmin');
        const user = server.create('user', { fullName: 'Hwang Yeji' });
        await render(
            hbs`<Moderators::Manager
                    @provider={{this.providerModel}}
                    as |moderatorManager|
                >
                    <Moderators::List
                        @manager={{moderatorManager}}
                    />
                </Moderators::Manager>`,
        );
        assert.dom('[data-test-add-moderator-button]').exists();
        assert.dom('[data-test-moderator-link]').exists({ count: 1 });
        await click('[data-test-add-moderator-button]');
        assert.dom('#osf-dialog-heading').hasText('Add a moderator');
        assert.dom('[data-test-confirm-add-moderator-button]').isEnabled();
        await click('[data-test-confirm-add-moderator-button]');
        assert.dom('[data-test-confirm-add-moderator-button]').isDisabled();
        assert.dom('[data-test-validation-errors="user"]').hasText(this.intl.t('validationErrors.empty'));
        await selectSearch('[data-test-select-user]', 'Yeji');
        await selectChoose('[data-test-select-user]', 'Hwang Yeji');
        await selectChoose('[data-test-select-permission]', 'Moderator');
        assert.dom('[data-test-validation-errors="user"]').doesNotExist();
        assert.dom('[data-test-validation-errors="permissionGroup"]').doesNotExist();
        await click('[data-test-confirm-add-moderator-button]');
        assert.dom('[data-test-moderator-link]').exists({ count: 2 });
        assert.dom(`[data-test-moderator-row="${user.id}"]`).exists();
    });

    test('can add moderator by email invite', async function(
        this: ModeratorsTestContext, assert,
    ) {
        const currentUser = server.create('user', { id: 'sprout' });
        const currentUserModel = await this.store.findRecord('user', 'sprout');
        this.owner.lookup('service:current-user').setProperties({
            testUser: currentUserModel, currentUserId: currentUserModel.id,
        });
        server.create('moderator', {
            id: currentUserModel.id,
            user: currentUser,
            provider: this.provider,
        }, 'asAdmin');
        await render(
            hbs`<Moderators::Manager
                    @provider={{this.providerModel}}
                    as |moderatorManager|
                >
                    <Moderators::List
                        @manager={{moderatorManager}}
                    />
                </Moderators::Manager>`,
        );
        assert.dom('[data-test-add-moderator-button]').exists();
        assert.dom('[data-test-moderator-link]').exists({ count: 1 });
        await click('[data-test-add-moderator-button]');
        assert.dom('#osf-dialog-heading').hasText('Add a moderator');
        await click('[data-test-toggle-invite-form]');
        assert.dom('[data-test-confirm-add-moderator-button]').isEnabled();
        await click('[data-test-confirm-add-moderator-button]');
        assert.dom('[data-test-confirm-add-moderator-button]').isDisabled();
        assert.dom('[data-test-validation-errors="email"]').containsText(this.intl.t('validationErrors.empty'));
        assert.dom('[data-test-validation-errors="email"]').containsText(
            this.intl.t('validationErrors.email', { description: 'This field' }),
        );
        assert.dom('[data-test-validation-errors="fullName"]').containsText(this.intl.t('validationErrors.empty'));

        await fillIn('[data-test-email-input]>div>input', 'testing@cos.io');
        await fillIn('[data-test-full-name-input]>div>input', 'Hwang Yeji');
        await selectChoose('[data-test-select-permission]', 'Moderator');
        await click('[data-test-confirm-add-moderator-button]');
        assert.dom('[data-test-moderator-link]').exists({ count: 2 });
    });
});

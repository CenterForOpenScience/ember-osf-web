import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-intl/test-support';
import RegistrationModel from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

interface ThisTestContext extends TestContext {
    registration: RegistrationModel;
}

module('Registries | Integration | Component | registration-list-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        this.store = this.owner.lookup('service:store');

        const provider = server.create('registration-provider');
        const registration = server.create('registration', {
            title: 'Test title',
            provider,
        }, 'withReviewActions');
        server.create('schema-response', {
            registration,
        }, 'withSchemaResponseActions');
        this.setProperties({ registration });
    });

    test('it renders pending', async function(this: ThisTestContext, assert) {
        const mirageRegistration = await this.store.findRecord('registration', this.registration.id);
        this.set('mirageRegistration', mirageRegistration);
        await render(hbs`
            <Registries::RegistrationList::Card
            @registration={{this.mirageRegistration}}
            @state='pending'
        />`);
        await a11yAudit(this.element);
        assert.dom('[data-test-registration-list-card]').isVisible();
        assert.dom('[data-test-registration-list-card-icon="pending"]').exists();
        assert.dom('[data-test-registration-title-link]').exists();
        assert.dom('[data-test-registration-title-link]').hasText(this.registration.title);
    });

    test('it renders accepted', async function(this: ThisTestContext, assert) {
        const mirageRegistration = await this.store.findRecord('registration', this.registration.id);
        this.set('mirageRegistration', mirageRegistration);
        await render(hbs`
            <Registries::RegistrationList::Card
            @registration={{this.mirageRegistration}}
            @state='accepted'
        />`);
        await a11yAudit(this.element);
        assert.dom('[data-test-registration-list-card]').isVisible();
        assert.dom('[data-test-registration-list-card-icon="accepted"]').exists();
        assert.dom('[data-test-registration-title-link]').exists();
        assert.dom('[data-test-registration-title-link]').hasText(this.registration.title);
    });

    test('it renders embargo', async function(this: ThisTestContext, assert) {
        const mirageRegistration = await this.store.findRecord('registration', this.registration.id);
        this.set('mirageRegistration', mirageRegistration);
        await render(hbs`
            <Registries::RegistrationList::Card
            @registration={{this.mirageRegistration}}
            @state='embargo'
        />`);
        await a11yAudit(this.element);
        assert.dom('[data-test-registration-list-card]').isVisible();
        assert.dom('[data-test-registration-list-card-icon="embargo"]').exists();
        assert.dom('[data-test-registration-title-link]').exists();
        assert.dom('[data-test-registration-title-link]').hasText(this.registration.title);
    });

    test('it renders withdrawn', async function(this: ThisTestContext, assert) {
        const mirageRegistration = await this.store.findRecord('registration', this.registration.id);
        this.set('mirageRegistration', mirageRegistration);
        await render(hbs`
            <Registries::RegistrationList::Card
            @registration={{this.mirageRegistration}}
            @state='withdrawn'
        />`);
        await a11yAudit(this.element);
        assert.dom('[data-test-registration-list-card]').isVisible();
        assert.dom('[data-test-registration-list-card-icon="withdrawn"]').exists();
        assert.dom('[data-test-registration-title-link]').exists();
        assert.dom('[data-test-registration-title-link]').hasText(this.registration.title);
    });

    test('it renders pending withdraw', async function(this: ThisTestContext, assert) {
        const mirageRegistration = await this.store.findRecord('registration', this.registration.id);
        this.set('mirageRegistration', mirageRegistration);
        await render(hbs`
            <Registries::RegistrationList::Card
            @registration={{this.mirageRegistration}}
            @state='pending_withdraw'
        />`);
        await a11yAudit(this.element);
        assert.dom('[data-test-registration-list-card]').isVisible();
        assert.dom('[data-test-registration-list-card-icon="pending_withdraw"]').exists();
        assert.dom('[data-test-registration-title-link]').exists();
        assert.dom('[data-test-registration-title-link]').hasText(this.registration.title);
    });

    test('it renders rejected', async function(this: ThisTestContext, assert) {
        const mirageRegistration = await this.store.findRecord('registration', this.registration.id);
        this.set('mirageRegistration', mirageRegistration);
        await render(hbs`
            <Registries::RegistrationList::Card
            @registration={{this.mirageRegistration}}
            @state='rejected'
        />`);

        await a11yAudit(this.element);
        assert.dom('[data-test-registration-list-card]').isVisible();
        assert.dom('[data-test-registration-list-card-icon="rejected"]').exists();
        assert.dom('[data-test-registration-title-link]').doesNotExist();
        assert.dom('[data-test-registration-list-card-title]').hasText(this.registration.title);
    });

    test('it renders pending revision', async function(this: ThisTestContext, assert) {
        const mirageRegistration = await this.store.findRecord('registration', this.registration.id);
        mirageRegistration.revisionState = RevisionReviewStates.RevisionPendingModeration;
        this.set('mirageRegistration', mirageRegistration);
        await render(hbs`
            <Registries::RegistrationList::Card
            @registration={{this.mirageRegistration}}
            @state='pending_moderation'
        />`);
        await a11yAudit(this.element);
        assert.dom('[data-test-registration-list-card]').isVisible();
        assert.dom('[data-test-registration-list-card-icon="pending_moderation"]').exists();
        assert.dom('[data-test-registration-title-link]').exists();
        assert.dom('[data-test-registration-list-card-title]').hasText(this.registration.title);
    });
});

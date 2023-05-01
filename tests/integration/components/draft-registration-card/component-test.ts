import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { timeout } from 'ember-concurrency';
import { TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
import { module, test } from 'qunit';
import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | draft-registration-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.loadFixtures('registration-providers');
        server.loadFixtures('licenses');
    });

    test('it renders draftRegistration for admins', async function(this: TestContext, assert) {
        const user = server.create('user');
        const draft = server.create('draft-registration', {
            id: 'pregc',
            initiator: user,
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'currentUserIsAdmin');
        const draftRegistration = await this.store.findRecord('draft-registration', draft.id);
        this.set('draftRegistration', draftRegistration);

        await render(hbs`<DraftRegistrationCard @draftRegistration={{this.draftRegistration}} />`);
        await timeout(500);

        const initiated = `${this.intl.t('osf-components.draft-registration-card.initiated_by')} `
            + `${user.fullName}`;
        const formType = `${this.intl.t('osf-components.draft-registration-card.form_type')} `
            + `${draftRegistration.registrationSchema.get('name')}`;
        const providerName = 'OSF Registries';
        const dateStarted = `${this.intl.t('osf-components.draft-registration-card.started')} `
            + `${moment(draftRegistration.datetimeInitiated)}`;
        const dateUpdated = `${this.intl.t('osf-components.draft-registration-card.last_updated')} `
            + `${moment(draftRegistration.datetimeUpdated)}`;

        assert.dom('[data-test-header-placeholder]').doesNotExist();
        assert.dom('[data-test-content-placeholder]').doesNotExist();

        assert.dom('[data-test-draft-registration-card-title]')
            .hasText(draftRegistration.title);
        assert.dom('[data-test-initiated-by]').containsText(initiated);
        assert.dom('[data-test-form-type]').containsText(formType);
        assert.dom('[data-test-provider-name]').containsText(providerName);
        assert.dom('[data-test-time-initiated]').containsText(dateStarted);
        assert.dom('[data-test-time-updated]').containsText(dateUpdated);
        assert.dom('[data-test-draft-card-edit]').exists('Admins can edit draft');
        assert.dom('[data-test-draft-card-delete]').exists('Admins can delete draft');
        assert.dom('[data-test-draft-card-review]').exists('Admins can review draft');
    });

    test('it renders draftRegistration for read-write users', async function(this: TestContext, assert) {
        const draft = server.create('draft-registration', 'currentUserIsReadAndWrite');
        const draftRegistration = await this.store.findRecord('draft-registration', draft.id);
        this.set('draftRegistration', draftRegistration);

        await render(hbs`<DraftRegistrationCard @draftRegistration={{this.draftRegistration}} />`);

        assert.dom('[data-test-draft-card-edit]').exists('Read-write users can edit draft');
        assert.dom('[data-test-draft-card-delete]').doesNotExist('Read-write users cannot delete draft');
        assert.dom('[data-test-draft-card-review]').exists('Read-write users can review draft');
    });

    test('it renders draftRegistration for read-only users', async function(this: TestContext, assert) {
        const draft = server.create('draft-registration', 'currentUserIsReadOnly');
        const draftRegistration = await this.store.findRecord('draft-registration', draft.id);
        this.set('draftRegistration', draftRegistration);

        await render(hbs`<DraftRegistrationCard @draftRegistration={{this.draftRegistration}} />`);

        assert.dom('[data-test-draft-card-edit]').doesNotExist('Read-only users cannot edit draft');
        assert.dom('[data-test-draft-card-delete]').doesNotExist('Read-only users cannot delete draft');
        assert.dom('[data-test-draft-card-review]').exists('Read-only users can review draft');
    });

    test('placeholders appear without draftRegistration', async assert => {
        await render(hbs`<DraftRegistrationCard />`);
        assert.dom('[data-test-header-placeholder]').exists();
        assert.dom('[data-test-content-placeholder]').exists();
    });
});

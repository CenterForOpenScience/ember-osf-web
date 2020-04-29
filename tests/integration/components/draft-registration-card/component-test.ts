import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { module, test } from 'qunit';
import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | draft-registration-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
        this.owner.register('service:router', OsfLinkRouterStub);
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.loadFixtures('registration-providers');
        server.loadFixtures('licenses');
    });

    test('it renders draftRegistration', async function(this: TestContext, assert) {
        const user = server.create('user');
        const draft = server.create('draft-registration', {
            id: 'pregc',
            initiator: user,
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        });
        const draftRegistration = await this.store.findRecord('draft-registration', draft.id);
        this.set('draftRegistration', draftRegistration);

        const initiated = `${this.intl.t('osf-components.draft-registration-card.initiated_by')} ` +
                        `${user.fullName}`;
        const dateStarted = `${this.intl.t('osf-components.draft-registration-card.started')} ` +
                            `${moment(draftRegistration.datetimeInitiated)}`;
        const dateUpdated = `${this.intl.t('osf-components.draft-registration-card.last_updated')} ` +
                            `${moment(draftRegistration.datetimeUpdated)}`;

        await render(hbs`<DraftRegistrationCard @draftRegistration={{this.draftRegistration}} />`);

        assert.dom('[data-test-header-placeholder]').doesNotExist();
        assert.dom('[data-test-content-placeholder]').doesNotExist();

        assert.dom('[data-test-draft-registration-card-title]')
            .hasText(draftRegistration.registrationSchema.get('name'));
        assert.dom('[data-test-initiated-by]').containsText(initiated);
        assert.dom('[data-test-time-initiated]').containsText(dateStarted);
        assert.dom('[data-test-time-updated]').containsText(dateUpdated);
    });

    test('placeholders appear without draftRegistration', async assert => {
        await render(hbs`<DraftRegistrationCard />`);
        assert.dom('[data-test-header-placeholder]').exists();
        assert.dom('[data-test-content-placeholder]').exists();
    });
});

import { click, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
// @ts-ignore: add ember-flatpickr types
import { setFlatpickrDate } from 'ember-flatpickr/test-support/helpers';
import { t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
import { module, test } from 'qunit';

import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

module('Integration | Component | finalize-registration-modal', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('make registration public immediately', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const provider = server.create('registration-provider');
        const registration = server.create('registration', { provider });
        const node = server.create('node', 'currentUserAdmin');
        const draftRegistration = server.create('draft-registration', { branchedFrom: node });

        const registrationModel = await this.store.findRecord('registration', registration.id);
        this.set('draftManager', { provider, draftRegistration, validateAllVisitedPages: () => { /* noop */ } });
        this.set('model', registrationModel);
        this.set('isOpen', false);
        await render(hbs`
            <Registries::FinalizeRegistrationModal::Manager
                @registration={{this.model}}
                @draftManager={{this.draftManager}}
                as |manager|
            >
                <Registries::FinalizeRegistrationModal @isOpen={{this.isOpen}} @manager={{manager}} />
            </Registries::FinalizeRegistrationModal::Manager>
        `);
        // Open the dialog
        this.set('isOpen', true);
        await settled();

        // Check that the submit button is disabled
        assert.dom('[data-test-submit-registration-button]').isDisabled();
        // Check that the `Create doi` checkbox is not visible
        assert.dom('[data-test-create-doi-label]').doesNotExist();
        // Click immediate radio button
        await click('[data-test-immediate-button]');
        // Check that the submit button is enabled
        assert.dom('[data-test-submit-registration-button]').isNotDisabled();
        // Check that the `create doi` label is now visible
        assert.dom('[data-test-create-doi-label]').exists();
        // Check that `embargoEndDate` of the registration model is null
        assert.equal(registrationModel.embargoEndDate, null);
        // Click `Creat doi` button
        await click('[data-test-create-doi-label]');
        // Check that `createDoi` of the registration model is true
        assert.equal(registrationModel.createDoi, true);
        // Click embargo radio button
        await click('[data-test-embargo-button]');
        // Check that the submit button is disabled again
        assert.dom('[data-test-submit-registration-button]').isDisabled();

        // Close the dialog
        this.set('isOpen', false);
    });

    test('embargo registration', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const provider = server.create('registration-provider');
        const registration = server.create('registration', { provider });
        const node = server.create('node', 'currentUserAdmin');
        const draftRegistration = server.create('draft-registration', { branchedFrom: node });

        const registrationModel = await this.store.findRecord('registration', registration.id);
        this.set('draftManager', { provider, draftRegistration });
        this.set('model', registrationModel);
        this.set('isOpen', false);
        await render(hbs`
            <Registries::FinalizeRegistrationModal::Manager
                @registration={{this.model}}
                @draftManager={{this.draftManager}}
                as |manager|
            >
                <Registries::FinalizeRegistrationModal @isOpen={{this.isOpen}} @manager={{manager}} />
            </Registries::FinalizeRegistrationModal::Manager>
        `);
        // Open the dialog
        this.set('isOpen', true);
        await settled();

        // Check that the submit button is disabled
        assert.dom('[data-test-submit-registration-button]').isDisabled();
        // Click embargo radio button
        await click('[data-test-embargo-button]');
        // Check that the submit button is disabled
        assert.dom('[data-test-submit-registration-button]').isDisabled();
        // Check that `embargoEndDate` of the registration model is null
        assert.equal(registrationModel.embargoEndDate, null);
        // Enter an invalid date for embargo
        await setFlatpickrDate('[data-test-embargo-date-input] > div > input', moment().format('MM/DD/YYYY'));
        // Check that`embargoEndDate` of the registration model is null
        // And that the submit button is disabled
        assert.equal(registrationModel.embargoEndDate, null);
        assert.dom('[data-test-submit-registration-button]').isDisabled();
        // TODO: Uncomment these lines once the potential race condition for validated-input/date is resolved
        // // Enter a valid date for embargo
        // const validDate = moment().add('days', 15).startOf('day');
        // await fillIn('[data-test-embargo-date-input] > div > input', validDate.format('MM/DD/YYYY'));
        // await blur('[data-test-embargo-date-input] > div > input');
        // assert.deepEqual(registrationModel.embargoEndDate, validDate.toDate());
        // // Check that the submit button is enabled
        // assert.dom('[data-test-submit-registration-button]').isNotDisabled();
        // // Click immediate radio button
        // await click('[data-test-immediate-button]');
        // // Check that the submit button is enabled
        // assert.dom('[data-test-submit-registration-button]').isNotDisabled();

        // // Close the dialog
        this.set('isOpen', false);
    });

    test('almost done modal content: no moderation with project', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const noModerationProvider = server.create('registration-provider', { reviewsWorkflow: null });
        const node = server.create('node', 'currentUserAdmin');
        const noModRegistration = server.create(
            'registration',
            { provider: noModerationProvider },
        );
        const draftRegistration = server.create('draft-registration', { branchedFrom: node });

        const registrationModel = await this.store.findRecord('registration', noModRegistration.id);
        this.set('draftManager', {
            provider: noModerationProvider,
            draftRegistration,
            validateAllVisitedPages: () => { /* noop */ },
        });
        this.set('model', registrationModel);
        this.set('isOpen', true);
        await render(hbs`
            <Registries::FinalizeRegistrationModal::Manager
                @registration={{this.model}}
                @draftManager={{this.draftManager}}
                as |manager|
            >
                <Registries::FinalizeRegistrationModal @isOpen={{this.isOpen}} @manager={{manager}} />
            </Registries::FinalizeRegistrationModal::Manager>
        `);
        // Click immediate radio button
        await click('[data-test-immediate-button]');
        // Click submit button
        await click('[data-test-submit-registration-button]');

        const opts = { learnMoreLink: 'aaa.aa', htmlSafe: true };
        assert.dom('[data-test-finalize-main]').hasTextContaining(
            stripHtmlTags(t('registries.finalizeRegistrationModal.notice.noModerationFromProject', opts).toString()),
            'modal shows warning',
        );
        assert.dom('[data-test-finalize-main]').doesNotHaveTextContaining(
            'A moderator must review and approve', 'modal does not mention moderation for unmoderated providers',
        );
    });

    test('almost done modal content: with moderation with project', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const withModerationProvider = server.create('registration-provider');
        const node = server.create('node', 'currentUserAdmin');
        const withModRegistration = server.create(
            'registration',
            { provider: withModerationProvider },
        );
        const draftRegistration = server.create('draft-registration', { branchedFrom: node });

        const registrationModel = await this.store.findRecord('registration', withModRegistration.id);
        this.set(
            'draftManager',
            {
                provider: withModerationProvider,
                reviewsWorkflow: 'pre-moderation',
                draftRegistration,
                validateAllVisitedPages: () => { /* noop */ },
            },
        );
        this.set('model', registrationModel);
        this.set('isOpen', true);
        await render(hbs`
            <Registries::FinalizeRegistrationModal::Manager
                @registration={{this.model}}
                @draftManager={{this.draftManager}}
                as |manager|
            >
                <Registries::FinalizeRegistrationModal @isOpen={{this.isOpen}} @manager={{manager}} />
            </Registries::FinalizeRegistrationModal::Manager>
        `);
        // Click immediate radio button
        await click('[data-test-immediate-button]');
        // Click submit button
        await click('[data-test-submit-registration-button]');

        const opts = { learnMoreLink: 'aaa.aa', htmlSafe: true };
        assert.dom('[data-test-finalize-main]').hasTextContaining(
            stripHtmlTags(t('registries.finalizeRegistrationModal.notice.withModerationFromProject', opts).toString()),
            'modal shows warning with moderation for moderated providers',
        );
    });

    test('almost done modal content: no moderation no project', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const noModerationProvider = server.create('registration-provider', { reviewsWorkflow: null });
        const noModRegistration = server.create(
            'registration',
            { provider: noModerationProvider },
        );
        const draftRegistration = server.create('draft-registration', { hasProject: false });

        const registrationModel = await this.store.findRecord('registration', noModRegistration.id);
        this.set('draftManager', {
            provider: noModerationProvider,
            draftRegistration,
            validateAllVisitedPages: () => { /* noop */ },
        });
        this.set('model', registrationModel);
        this.set('isOpen', true);
        await render(hbs`
            <Registries::FinalizeRegistrationModal::Manager
                @registration={{this.model}}
                @draftManager={{this.draftManager}}
                as |manager|
            >
                <Registries::FinalizeRegistrationModal @isOpen={{this.isOpen}} @manager={{manager}} />
            </Registries::FinalizeRegistrationModal::Manager>
        `);
        // Click immediate radio button
        await click('[data-test-immediate-button]');
        // Click submit button
        await click('[data-test-submit-registration-button]');

        const opts = { learnMoreLink: 'aaa.aa', htmlSafe: true };
        assert.dom('[data-test-finalize-main]').hasTextContaining(
            stripHtmlTags(t('registries.finalizeRegistrationModal.notice.noModerationNoProject', opts).toString()),
            'modal shows warning',
        );
        assert.dom('[data-test-finalize-main]').doesNotHaveTextContaining(
            'A moderator must review and approve', 'modal does not mention moderation for unmoderated providers',
        );
    });

    test('almost done modal content: with moderation no project', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const withModerationProvider = server.create('registration-provider');
        const withModRegistration = server.create(
            'registration',
            { provider: withModerationProvider },
        );
        const draftRegistration = server.create('draft-registration', { hasProject: false });

        const registrationModel = await this.store.findRecord('registration', withModRegistration.id);
        this.set(
            'draftManager',
            {
                provider: withModerationProvider,
                reviewsWorkflow: 'pre-moderation',
                draftRegistration,
                validateAllVisitedPages: () => { /* noop */ },
            },
        );
        this.set('model', registrationModel);
        this.set('isOpen', true);
        await render(hbs`
            <Registries::FinalizeRegistrationModal::Manager
                @registration={{this.model}}
                @draftManager={{this.draftManager}}
                as |manager|
            >
                <Registries::FinalizeRegistrationModal @isOpen={{this.isOpen}} @manager={{manager}} />
            </Registries::FinalizeRegistrationModal::Manager>
        `);
        // Click immediate radio button
        await click('[data-test-immediate-button]');
        // Click submit button
        await click('[data-test-submit-registration-button]');

        const opts = { learnMoreLink: 'aaa.aa', htmlSafe: true };
        assert.dom('[data-test-finalize-main]').hasTextContaining(
            stripHtmlTags(t('registries.finalizeRegistrationModal.notice.withModerationNoProject', opts).toString()),
            'modal shows warning with moderation for moderated providers',
        );
    });
});

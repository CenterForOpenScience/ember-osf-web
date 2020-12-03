// @ts-ignore
import { click, render, setupOnerror } from '@ember/test-helpers'; // type for setupError is not defined :/
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t } from 'ember-intl/test-support';

import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | review-actions-list', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(() => {
        server.create('registration', {
            id: 'single',
        }, 'withSingleReviewAction');
        server.create('registration', {
            id: 'multi',
        }, 'withReviewActions');
    });

    test('error fetching review-actions', async function(assert) {
        setupOnerror((e: any) => assert.ok(e, 'Error is handled'));

        server.namespace = '/v2';
        server.get('/registrations/:parentID/actions', () => ({
            errors: [{ detail: 'Ruh-oh Raggie' }],
        }), 400);
        this.store = this.owner.lookup('service:store');
        const registrationModel = server.create('registration', 'withReviewActions');
        const registration = await this.store.findRecord('registration', registrationModel.id);
        this.set('registration', registration);

        await render(hbs`<Registries::ReviewActionsList @registration={{this.registration}}/>`);
        assert.dom('#toast-container', document as any).hasTextContaining('Ruh-oh Raggie',
            'Toast error shown after failing to get review actions');
        assert.dom('[data-test-no-actions-found]').doesNotExist('No actions message not shown');
        assert.dom('[data-test-loading-actions-failed]').exists('Loading error shown');
        assert.dom('[data-test-registration-list-card-latest-action]').doesNotExist('Latest action not shown');
        assert.dom('[data-test-registration-card-toggle-actions]').doesNotExist('Toggle button not shown');
        setupOnerror(); // Reset the ember.onerror function
    });

    test('no review-actions', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const noActionRegistrationModel = server.create('registration');
        const noActionRegistration = await this.store.findRecord('registration', noActionRegistrationModel.id);
        this.set('registration', noActionRegistration);

        await render(hbs`<Registries::ReviewActionsList @registration={{this.registration}}/>`);
        assert.dom('[data-test-no-actions-found]').exists('No actions message shown');
        assert.dom('[data-test-loading-actions-failed]').doesNotExist('Loading error not shown');
        assert.dom('[data-test-registration-list-card-latest-action]').doesNotExist('Latest action not shown');
        assert.dom('[data-test-registration-card-toggle-actions]').doesNotExist('Toggle button not shown');
    });

    test('one review-action', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const oneActionRegistrationModel = server.create('registration', 'withSingleReviewAction');
        const oneActionRegistration = await this.store.findRecord('registration', oneActionRegistrationModel.id);
        this.set('registration', oneActionRegistration);

        await render(hbs`<Registries::ReviewActionsList @registration={{this.registration}}/>`);
        assert.dom('[data-test-no-actions-found]').doesNotExist('No actions message not shown');
        assert.dom('[data-test-loading-actions-failed]').doesNotExist('Loading error not shown');
        assert.dom('[data-test-registration-list-card-latest-action]').exists('Latest action shown');
        assert.dom('[data-test-registration-card-toggle-actions]').doesNotExist('Toggle button not shown');
    });

    test('multiple review-actions', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const registrationModel = server.create('registration', 'withReviewActions');
        const oneActionRegistration = await this.store.findRecord('registration', registrationModel.id);
        this.set('registration', oneActionRegistration);

        await render(hbs`<Registries::ReviewActionsList @registration={{this.registration}}/>`);
        assert.dom('[data-test-no-actions-found]').doesNotExist('No actions message not shown');
        assert.dom('[data-test-loading-actions-failed]').doesNotExist('Loading error not shown');
        assert.dom('[data-test-registration-list-card-latest-action]').exists('Latest action shown');
        assert.dom('[data-test-registration-card-toggle-actions]').exists('Toggle button shown');
        assert.dom('[data-test-registration-card-toggle-actions]').hasText(`${t('registries.reviewActionsList.show')}`,
            'Toggle button has correct text before showing all');
        assert.dom('[data-test-registration-list-card-more-actions]').doesNotExist('More actions not shown');

        await click('[data-test-registration-card-toggle-actions]');
        assert.dom('[data-test-registration-list-card-more-actions]')
            .exists({ count: 2 }, 'Two more actions are shown after clicking the toggler');
        assert.dom('[data-test-registration-card-toggle-actions]').hasText(`${t('registries.reviewActionsList.hide')}`,
            'Toggle button has correct text after showing all');
    });
});

import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { timeout } from 'ember-concurrency';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

module('Integration | Component | new-update-modal', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
        this.set('noop', () => {/* noop */});
    });

    test('renders updates allowed', async function(this: TestContext, assert) {
        const allowUpdateProvider = server.create('registration-provider');
        const mirageRegistration = server.create('registration', { provider: allowUpdateProvider });
        const registration = await this.store.findRecord('registration', mirageRegistration.id);
        this.set('registration', registration);
        await render(
            hbs`<Registries::NewUpdateModal
                @isOpen={{true}}
                @registration={{this.registration}}
                @onClose={{this.noop}}
            />`,
        );
        await timeout(100);
        assert.dom('[data-test-new-update-dialog-heading]').hasText(
            this.intl.t('registries.newUpdateModal.modalHeader'),
            'Modal header is correct',
        );
        assert.dom('[data-test-new-update-dialog-main]').hasTextContaining(
            stripHtmlTags(this.intl.t('registries.newUpdateModal.modalBodyFirst')),
            'Modal body is correct',
        );
        assert.dom('[data-test-new-update-dialog-main-icon').hasAria('label', this.intl.t('general.edit'));
        assert.dom('[data-test-new-update-dialog-footer-cancel]').exists('Modal footer contains cancel button');
        assert.dom('[data-test-new-update-dialog-footer-next]').exists('Modal footer contains next button');
        assert.dom('[data-test-new-update-dialog-footer-ok]').doesNotExist('Modal footer does not contain ok button');
    });

    test('renders updates not allowed', async function(this: TestContext, assert) {
        const noUpdateProvider = server.create('registration-provider', { name: 'Team Rocket', allowUpdates: false });
        const mirageRegistration = server.create('registration', { provider: noUpdateProvider });
        const registration = await this.store.findRecord('registration', mirageRegistration.id);
        this.set('registration', registration);

        await render(
            hbs`<Registries::NewUpdateModal
                @isOpen={{true}}
                @registration={{this.registration}}
                @onClose={{this.noop}}
            />`,
        );
        await timeout(100);
        assert.dom('[data-test-new-update-dialog-heading]').hasText(
            this.intl.t('registries.newUpdateModal.modalHeaderNoUpdates'),
            'Modal header is correct',
        );
        assert.dom('[data-test-new-update-dialog-main]').containsText(
            stripHtmlTags(this.intl.t('registries.newUpdateModal.modalBodyNoUpdates', { registryName: 'Team Rocket' })),
            'Modal body is correct',
        );
        assert.dom('[data-test-new-update-dialog-main-icon').doesNotExist('No icon is displayed');
        assert.dom('[data-test-new-update-dialog-footer-ok]').exists('Modal footer contains ok button');
        assert.dom('[data-test-new-update-dialog-footer-cancel]')
            .doesNotExist('Modal footer does not contain cancel button');
        assert.dom('[data-test-new-update-dialog-footer-next]')
            .doesNotExist('Modal footer does not contain next button');
    });
});

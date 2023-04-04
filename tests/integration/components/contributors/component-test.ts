import { click, fillIn, findAll, render, triggerKeyEvent } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { timeout } from 'ember-concurrency';
import { setupIntl, t } from 'ember-intl/test-support';
import { Permission } from 'ember-osf-web/models/osf-model';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';
import { selectChoose } from 'ember-power-select/test-support';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { reorder } from 'ember-sortable/test-support/helpers';
import { TestContext } from 'ember-test-helpers';
import { module, skip, test } from 'qunit';
import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

interface ThisTestContext extends TestContext {
    currentUser: CurrentUserStub;
}

module('Integration | Component | contributors', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        this.owner.register('service:current-user', CurrentUserStub);
        this.currentUser = this.owner.lookup('service:current-user');
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.loadFixtures('registration-providers');
        server.loadFixtures('licenses');
    });

    test('it renders', async function(assert) {
        // Translations
        const headingName = t('osf-components.contributors.headings.name');
        const headingPermission = t('osf-components.contributors.headings.permission');
        const headingCitation = t('osf-components.contributors.headings.citation');

        const registration = server.create('draft-registration', {}, 'withContributors');
        const registrationModel = await this.store.findRecord('draft-registration', registration.id);
        this.set('draftRegistration', registrationModel);

        await render(hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} />`);

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
        assert.dom('[data-test-heading-name]').hasText(headingName);
        assert.dom('[data-test-heading-permission]').hasText(headingPermission);
        assert.dom('[data-test-heading-citation]').hasText(headingCitation);
    });

    test('read-only user card renders', async function(assert) {
        const registration = server.create('draft-registration', {}, 'withContributors');
        const registrationModel = await this.store.findRecord('draft-registration', registration.id);
        this.set('draftRegistration', registrationModel);

        const { contributors } = registrationModel;
        await render(
            hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} @widgetMode='readonly' />`,
        );
        contributors.forEach(contributor => {
            const userPermission = t(`osf-components.contributors.permissions.${contributor.permission}`);
            const userCitation = t(`osf-components.contributors.citation.${contributor.bibliographic}`);

            assert.dom('[data-test-contributor-card]').exists();
            assert.dom('[data-test-contributor-card-main]').exists();
            assert.dom('[data-test-contributor-gravatar]').exists();
            assert.dom(`[data-test-contributor-link="${contributor.id}"]`)
                .hasText(contributor.users.get('fullName'));
            assert.dom(`[data-test-contributor-permission="${contributor.id}"]`)
                .hasText(userPermission);
            assert.dom(`[data-test-contributor-citation="${contributor.id}"]`)
                .hasText(userCitation);
        });
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('read-only user card renders unregistered contributor', async function(assert) {
        const registration = server.create('draft-registration');
        const unregContributor = server.create('contributor', {
            draftRegistration: registration,
        }, 'unregistered');
        const registrationModel = await this.store.findRecord('draft-registration', registration.id);
        this.set('draftRegistration', registrationModel);

        await render(
            hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} @widgetMode='readonly' />`,
        );
        const userPermission = t(`osf-components.contributors.permissions.${unregContributor.permission}`);
        const userCitation = t(`osf-components.contributors.citation.${unregContributor.bibliographic}`);

        assert.dom('[data-test-contributor-card]').exists();
        assert.dom('[data-test-contributor-card-main]').exists();
        assert.dom('[data-test-contributor-gravatar]').exists();
        assert.dom('[data-test-contributor-link]').doesNotExist();
        assert.dom('[data-test-contributor-card-main]')
            .containsText(unregContributor.unregisteredContributor!);
        assert.dom(`[data-test-contributor-permission="${unregContributor.id}"]`)
            .hasText(userPermission);
        assert.dom(`[data-test-contributor-citation="${unregContributor.id}"]`)
            .hasText(userCitation);
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('read-only contributor card can remove self as contributor', async function(assert) {
        const currentUser = server.create('user', { id: 'sprout' });
        const currentUserModel = await this.store.findRecord('user', 'sprout');
        this.owner.lookup('service:current-user').setProperties({
            testUser: currentUserModel, currentUserId: currentUserModel.id,
        });

        const firstContributor = server.create('contributor', {
            fullName: 'First Contributor',
            index: 0,
            id: 'Remove',
            users: currentUser,
        });
        const secondContributor = server.create('contributor', {
            fullName: 'Second Contributor',
            index: 1,
            id: 'Keep',
        });
        const draftRegistration = server.create('draft-registration', {
            contributors: [firstContributor, secondContributor],
        });
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('draftRegistration', registrationModel);
        await render(
            hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} @widgetMode='readonly' />`,
        );
        assert.dom('[data-test-contributor-card="Keep"]').isVisible(
            '"Keep" card is visible before contributor removal',
        );
        assert.dom('[data-test-contributor-card="Remove"]').isVisible(
            '"Remove" card is visible before contributor removal',
        );
        assert.dom('[data-test-contributor-remove-self="Remove"]')
            .exists('There is a delete button for currentUser contributor');
        assert.dom('[data-test-contributor-remove-self="Keep"]')
            .doesNotExist('There is no delete button for non-currentUser contributor');
        await click('[data-test-contributor-remove-self="Remove"] > button');
        await click('[data-test-confirm-delete]');

        assert.dom('[data-test-contributor-card="Keep"]').isVisible(
            '"Keep" card is visible after contributor removal',
        );
        assert.dom('[data-test-contributor-card="Remove"]').isNotVisible(
            '"Remove" card is not visible after contributor removal',
        );
    });

    test('editable user card renders', async function(assert) {
        const draftRegistration = server.create('draft-registration');
        const contributor = server.create('contributor', {
            draftRegistration,
            permission: Permission.Admin,
            bibliographic: false,
        });
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('draftRegistration', registrationModel);

        await render(
            hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} @widgetMode={{'editable'}} />`,
        );

        assert.dom('[data-test-contributor-card]').exists();
        assert.dom('[data-test-contributor-card-main]').exists();
        assert.dom('[data-test-contributor-gravatar]').exists();
        assert.dom(`[data-test-contributor-link="${contributor.id}"]`)
            .hasText(contributor.users.fullName);
        assert.dom(`[data-test-contributor-permission="${contributor.id}"]`)
            .hasText('Administrator');
        assert.dom('[data-test-contributor-citation-checkbox]').isNotChecked();
        await clickTrigger();
        await selectChoose('[data-test-contributor-permission]', 'Read');
        await click('[data-test-contributor-citation-checkbox]');
        assert.dom(`[data-test-contributor-permission="${contributor.id}"]`)
            .hasText('Read');
        assert.dom('[data-test-contributor-citation-checkbox]').isChecked();
        assert.dom(`[data-test-contributor-remove="${contributor.id}"]`).exists('Remove contributor button is visible');
    });

    test('editable contributor card can remove contributor', async function(assert) {
        const firstContributor = server.create('contributor', {
            fullName: 'First Contributor',
            index: 0,
            id: 'Keep',
        });
        const secondContributor = server.create('contributor', {
            fullName: 'Second Contributor',
            index: 1,
            id: 'Remove',
        });
        const draftRegistration = server.create('draft-registration', {
            contributors: [firstContributor, secondContributor],
        });
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('draftRegistration', registrationModel);
        await render(
            hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} @widgetMode={{'editable'}} />`,
        );
        assert.dom('[data-test-contributor-card="Keep"]').isVisible(
            '"Keep" card is visible before contributor removal',
        );
        assert.dom('[data-test-contributor-card="Remove"]').isVisible(
            '"Remove" card is visible before contributor removal',
        );
        const deleteButtons = findAll('[data-test-delete-button]');
        const removeButton = deleteButtons[1];
        await click(removeButton);
        await click('[data-test-confirm-delete]');

        assert.dom('[data-test-contributor-card="Keep"]').isVisible(
            '"Keep" card is visible after contributor removal',
        );
        assert.dom('[data-test-contributor-card="Remove"]').isNotVisible(
            '"Remove" card is not visible after contributor removal',
        );
    });

    test('editable user card can be reordered using mouse', async function(assert) {
        const firstContributor = server.create('contributor', {
            fullName: 'First Contributor',
            index: 0,
            id: 'first',
        });
        const secondContributor = server.create('contributor', {
            fullName: 'Second Contributor',
            index: 1,
            id: 'second',
        });
        const draftRegistration = server.create('draft-registration', {
            contributors: [firstContributor, secondContributor],
        });
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('draftRegistration', registrationModel);
        await render(
            hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} @widgetMode={{'editable'}} />`,
        );
        const elementsBefore = findAll('[data-test-contributor-card]');
        assert.equal(elementsBefore[0].getAttribute('data-test-contributor-card'), 'first');
        assert.equal(elementsBefore[1].getAttribute('data-test-contributor-card'), 'second');
        await reorder(
            'mouse',
            '[data-test-sortable-handle]',
            '[data-test-sortable-handle="second"]',
            '[data-test-sortable-handle="first"]',
        );
        const elementsAfter = findAll('[data-test-contributor-card]');
        assert.equal(elementsAfter[0].getAttribute('data-test-contributor-card'), 'second');
        assert.equal(elementsAfter[1].getAttribute('data-test-contributor-card'), 'first');
    });

    skip('editable user card can be reordered using keyboard', async function(assert) {
        const firstContributor = server.create('contributor', {
            fullName: 'First Contributor',
            index: 0,
            id: 'first',
        });
        const secondContributor = server.create('contributor', {
            fullName: 'Second Contributor',
            index: 1,
            id: 'second',
        });
        const draftRegistration = server.create('draft-registration', {
            contributors: [firstContributor, secondContributor],
        });
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('draftRegistration', registrationModel);
        await render(
            hbs`<Contributors::Widget @draftRegistration={{this.draftRegistration}} @widgetMode={{'editable'}} />`,
        );
        const elementsBefore = findAll('[data-test-contributor-card]');
        assert.equal(elementsBefore[0].getAttribute('data-test-contributor-card'), 'first');
        assert.equal(elementsBefore[1].getAttribute('data-test-contributor-card'), 'second');
        await triggerKeyEvent(
            '[data-test-sortable-handle="first"]',
            'keydown',
            13,
        );
        await triggerKeyEvent(
            '[data-test-sortable-handle="first"]',
            'keydown',
            40,
        );
        await triggerKeyEvent(
            '[data-test-sortable-handle="first"]',
            'keydown',
            13,
        );
        const elementsAfter = findAll('[data-test-contributor-card]');
        assert.equal(elementsAfter[0].getAttribute('data-test-contributor-card'), 'second');
        assert.equal(elementsAfter[1].getAttribute('data-test-contributor-card'), 'first');
    });

    test('searching and adding user as contributor works', async function(assert) {
        const suzy = server.create('user', {
            fullName: 'Bae Suzy',
            id: 'suzy',
        });
        const draftRegistration = server.create('draft-registration');
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('draftRegistration', registrationModel);
        this.set('toggleAddContributorWidget', () => null);

        await render(hbs`
            <Contributors::Widget
                @draftRegistration={{this.draftRegistration}}
                @toggleAddContributorWidget={{this.toggleAddContributorWidget}}
                @widgetMode={{'editable'}}
                @shouldShowAdd={{true}}
            />
        `);

        assert.dom('[data-test-user-search-input]').exists('User serach button renders');
        assert.dom('[data-test-add-unregistered-contributor-button]').exists('Add unregistered contrib button renders');
        assert.dom('[data-test-user-search-results]').exists('Search result continer renders');
        assert.dom('[data-test-contributor-card]').doesNotExist('No contributors are on the draft');
        await fillIn('[data-test-user-search-input]', 'Bae');
        await click('[data-test-user-search-button]');
        await selectChoose(`[data-test-user-permission="${suzy.id}"]`, 'Read');
        await click(`[data-test-user-citation-checkbox="${suzy.id}"]`);
        await click(`[data-test-add-contributor-button="${suzy.id}"`);
        assert.dom('[data-test-contributor-card]').exists({ count: 1 }, 'There is one contributor on the draft');
        assert.dom('[data-test-contributor-link]').hasText(suzy.fullName, 'Contributor name matches');
        assert.dom('[data-test-contributor-permission]').hasText('Read', 'Contributor permission matches');
        assert.dom('[data-test-contributor-citation-checkbox]')
            .isNotChecked('Contributor bibliographic status matches');
        assert.dom(`[data-test-add-contributor-button="${suzy.id}"`).doesNotExist('Add contributor button is gone');
    });

    test('adding unregistered contributor works', async function(assert) {
        const draftRegistration = server.create('draft-registration');
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('draftRegistration', registrationModel);
        this.set('toggleAddContributorWidget', () => null);

        await render(hbs`
            <Contributors::Widget
                @draftRegistration={{this.draftRegistration}}
                @toggleAddContributorWidget={{this.toggleAddContributorWidget}}
                @widgetMode={{'editable'}}
                @shouldShowAdd={{true}}
            />
        `);
        await click('[data-test-add-unregistered-contributor-button]');
        assert.dom('[data-test-add-button]').isEnabled(
            'Add button should be enabled even the form is not valid at first',
        );
        await click('[data-test-add-button]');
        assert.dom('[data-test-add-button]').isDisabled(
            'Add button should be disabled now that the form has been validated once',
        );

        await fillIn('[data-test-email-input] > div > input', 'some person');
        assert.dom('[data-test-validation-errors="email"]').exists('validates email');
        await fillIn('[data-test-email-input] > div > input', 'unregcontrib@cos.io');
        assert.dom('[data-test-validation-errors="email"]').doesNotExist('email validation msg is removed properly');
        await fillIn('[data-test-full-name-input] > div > input', '     ');
        assert.dom('[data-test-validation-errors="fullName"]').exists('validates name');
        await fillIn('[data-test-full-name-input] > div > input', 'Shin Sekyung');
        assert.dom('[data-test-validation-errors="fullName"]').doesNotExist('name validation msg is removed properly');
        await selectChoose('[data-test-select-permission]', 'Read');
        await click('[data-test-is-bibliographic]');
        assert.dom('[data-test-add-button]').isEnabled(
            'Add button should be enabled now that the form is valid',
        );
        await click('[data-test-add-button]');
        await timeout(500);
        assert.dom('[data-test-contributor-card]').exists({ count: 1 }, 'There is one contributor on the draft');
        assert.dom('[data-test-contributor-link]').hasText('Shin Sekyung', 'Contributor name matches');
        assert.dom('[data-test-contributor-permission]').hasText('Read', 'Contributor permission matches');
        assert.dom('[data-test-contributor-citation-checkbox]')
            .isNotChecked('Contributor bibliographic status matches');
    });
});

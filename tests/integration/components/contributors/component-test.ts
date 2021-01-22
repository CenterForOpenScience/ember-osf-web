import { click, findAll, render, triggerKeyEvent } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t } from 'ember-intl/test-support';
import { Permission } from 'ember-osf-web/models/osf-model';
import { selectChoose } from 'ember-power-select/test-support';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { reorder } from 'ember-sortable/test-support/helpers';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, skip, test } from 'qunit';
import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | contributors', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
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
        this.set('node', registrationModel);

        await render(hbs`<Contributors::Widget @node={{this.node}} />`);

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
        assert.dom('[data-test-heading-name]').hasText(headingName);
        assert.dom('[data-test-heading-permission]').hasText(headingPermission);
        assert.dom('[data-test-heading-citation]').hasText(headingCitation);
    });

    test('read-only user card renders', async function(assert) {
        const registration = server.create('draft-registration', {}, 'withContributors');
        const registrationModel = await this.store.findRecord('draft-registration', registration.id);
        this.set('node', registrationModel);

        const { contributors } = registrationModel;
        await render(hbs`<Contributors::Widget @node={{this.node}} />`);
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
        this.set('node', registrationModel);

        await render(hbs`<Contributors::Widget @node={{this.node}} />`);
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

    test('editable user card renders', async function(assert) {
        const draftRegistration = server.create('draft-registration');
        const contributor = server.create('contributor', {
            draftRegistration,
            permission: Permission.Admin,
            bibliographic: false,
        });
        const registrationModel = await this.store.findRecord('draft-registration', draftRegistration.id);
        this.set('node', registrationModel);

        await render(hbs`<Contributors::Widget @node={{this.node}} @widgetMode={{'editable'}} />`);

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
        this.set('node', registrationModel);
        await render(hbs`<Contributors::Widget @node={{this.node}} @widgetMode={{'editable'}} />`);
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
        this.set('node', registrationModel);
        await render(hbs`<Contributors::Widget @node={{this.node}} @widgetMode={{'editable'}} />`);
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
        this.set('node', registrationModel);
        await render(hbs`<Contributors::Widget @node={{this.node}} @widgetMode={{'editable'}} />`);
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
        await this.pauseTest();
        await triggerKeyEvent(
            '[data-test-sortable-handle="first"]',
            'keydown',
            13,
        );
        const elementsAfter = findAll('[data-test-contributor-card]');
        assert.equal(elementsAfter[0].getAttribute('data-test-contributor-card'), 'second');
        assert.equal(elementsAfter[1].getAttribute('data-test-contributor-card'), 'first');
    });
});

import Service from '@ember/service';
import { click, currentRouteName, currentURL, settled } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-i18n/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

const currentUserStub = Service.extend();
const storeStub = Service.extend();
const analyticsStub = Service.extend();

function getHrefAttribute(selector: string) {
    return document.querySelector(selector)!.getAttribute('href');
}

module('Registries | Acceptance | draft form', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:analytics', analyticsStub);

        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
    });

    test('it redirects to first page of the schema\'d form', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/1-`), 'At first schema page');
        assert.equal(currentRouteName(), 'registries.drafts.draft', 'At the expected route');
    });

    test('it redirects page-not-found if the pageIndex route param is out of range', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
        );

        await visit(`/registries/drafts/${registration.id}/99/`);

        assert.equal(currentRouteName(), 'registries.page-not-found', 'At page not found');
    });

    test('right saidenav controls', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/1-`), 'At first schema page');

        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-register]').doesNotExist();

        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-next-page]')!
            .includes(`/registries/drafts/${registration.id}/2-`));

        await click('[data-test-goto-next-page]');

        // Last page
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/2-`), 'At second (last) page');
        assert.dom('[data-test-goto-register]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').doesNotExist();

        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-previous-page]')!
            .includes(`/registries/drafts/${registration.id}/1-`));

        assert.dom('[data-test-goto-review]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-review]')!
            .includes(`/registries/drafts/${registration.id}/review`));

        await click('[data-test-goto-review]');

        // review page
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom('[data-test-read-only-response]').exists();

        assert.dom('data-test-goto-next-page').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();

        assert.dom('[data-test-goto-register]').isVisible();
        assert.dom('[data-test-goto-previous-page]').isVisible();

        // Can navigate back to the last page from review page
        await click('[data-test-goto-previous-page]');
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/2-`), 'At second (last) page');
    });

    test('register button is disabled: invalid responses', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registrationResponses = {
            'page-one_long-text': '',
            'page-one_multi-select': [],
            'page-one_multi-select-other': '',
            'page-one_short-text': null, // Required
            'page-one_single-select': 'tuna',
            'page-one_single-select-two': '',
        };
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator, registrationResponses },
        );

        await visit(`/registries/drafts/${registration.id}/review`);
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom('[data-test-goto-register]').isDisabled();
        assert.dom('[data-test-invalid-responses-text]').isVisible();
    });

    test('partial and finalize registration modal show, can register draft', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const rootNode = server.create('node');
        const childNode = server.create('node', { parent: rootNode });
        const grandChildNode = server.create('node', { parent: childNode });
        const registrationResponses = {
            'page-one_long-text': '',
            'page-one_multi-select': [],
            'page-one_multi-select-other': '',
            'page-one_short-text': 'ditto',
            'page-one_single-select': 'tuna',
            'page-one_single-select-two': '',
        };
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator, registrationResponses, branchedFrom: rootNode },
        );
        await visit(`/registries/drafts/${registration.id}/review`);
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom('[data-test-goto-register]').isNotDisabled();

        await click('[data-test-goto-register]');
        await settled();

        // PartialRegistrationModal
        assert.dom('#osf-dialog-heading').hasText(t('registries.partialRegistrationModal.title').toString());
        [rootNode, childNode, grandChildNode].mapBy('id').forEach(id => assert.dom(`[data-test-expand-child="${id}"]`));
        await click('[data-test-cancel-registration-button]');
        await settled();
        assert.dom('#osf-dialog-heading').isNotVisible('cancel closes the modal');

        await click('[data-test-goto-register]');
        await settled();
        assert.dom('[data-test-continue-registration-button]').isVisible();
        await click('[data-test-continue-registration-button]');

        // FinalizeRegistrationModal
        assert.dom('#osf-dialog-heading').hasText(t('registries.finalizeRegistrationModal.title').toString());
        assert.dom('[data-test-submit-registration-button]').isDisabled();

        await click('[data-test-back-button]');
        assert.dom('#osf-dialog-heading').hasText(
            t('registries.partialRegistrationModal.title').toString(),
            'back button switches to partialRegistrationModal',
        );

        await click('[data-test-continue-registration-button]');

        await click('[data-test-immediate-button]');
        assert.dom('[data-test-submit-registration-button]').isNotDisabled();

        await click('[data-test-submit-registration-button]');
        await settled();

        assert.equal(currentRouteName(), 'registries.overview.index', 'Redicted to new registration overview page');
    });
});

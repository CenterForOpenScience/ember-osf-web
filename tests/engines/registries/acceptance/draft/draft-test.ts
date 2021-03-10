import Service from '@ember/service';
import {
    click,
    currentRouteName,
    currentURL,
    fillIn,
    find,
    settled,
    triggerKeyEvent,
} from '@ember/test-helpers';
import { animationsSettled, TimeControl } from 'ember-animated/test-support';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'ember-get-config';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { deserializeResponseKey } from 'ember-osf-web/transforms/registration-response-key';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

const currentUserStub = Service.extend();
const storeStub = Service.extend();
const analyticsStub = Service.extend();

function getHrefAttribute(selector: string) {
    return document.querySelector(selector)!.getAttribute('href');
}

interface DraftFormTestContext extends TestContext {
    branchedFrom: ModelInstance<NodeModel>;
}

module('Registries | Acceptance | draft form', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: DraftFormTestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:analytics', analyticsStub);
        this.branchedFrom = server.create('node');

        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.loadFixtures('licenses');
        server.loadFixtures('registration-providers');
    });

    test('branded draft page', async function(this: DraftFormTestContext) {
        const provider = server.create('registration-provider', 'withBrand');
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const draftRegistration = server.create('draft-registration', {
            provider,
            registrationSchema,
            initiator,
            branchedFrom: this.branchedFrom,
        });
        await visit(`registries/drafts/${draftRegistration.id}/`);
        await percySnapshot('Branded draft page');
    });

    test('it redirects to review page of the draft form for read-only users', async function(
        this: DraftFormTestContext, assert,
    ) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
                currentUserPermissions: [Permission.Read],
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        assert.equal(currentRouteName(), 'registries.drafts.draft.review', 'Read-only users redirected to review page');

        // check leftnav
        const reviewNav = find('[data-test-link="review"]');
        assert.dom('[data-test-link="metadata"]').doesNotExist('Leftnav: Metadata label is not shown');
        assert.dom('[data-test-link="review"]').exists('Leftnav: Review label shown');
        assert.ok(reviewNav!.classList.toString().includes('Active'), 'LeftNav: Review is active page');

        // check rightnav
        assert.dom('[data-test-goto-register]').isDisabled('RightNav: Register button disabled');
        assert.dom('[data-test-goto-previous-page]').doesNotExist('RightNav: Back button not shown');

        // check metadata and form renderer
        assert.dom('[data-test-edit-button]').doesNotExist('MetadataRenderer: Edit button not shown');

        await percySnapshot('Read-only Review page: Desktop');

        // check mobile view
        setBreakpoint('mobile');
        await visit(`/registries/drafts/${registration.id}/metadata`);
        assert.equal(currentRouteName(), 'registries.drafts.draft.review',
            'Read-only users redirected to review page after trying to go to the metadata page');

        assert.dom('[data-test-sidenav-toggle]').doesNotExist('Mobile view: sidenav toggle not shown');
        assert.dom('[data-test-goto-previous-page]').doesNotExist('Mobile view: previous page button not shown');
        assert.dom('[data-test-goto-register]').isDisabled('Mobile view: Register button disabled');

        await percySnapshot('Read-only Review page: Mobile');
    });

    test('it redirects to metadata page of the draft form', async function(this: DraftFormTestContext, assert) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        assert.equal(currentRouteName(), 'registries.drafts.draft.metadata', 'At the expected route');
    });

    test('it redirects page-not-found if the pageIndex route param is out of range', async function(
        this: DraftFormTestContext, assert,
    ) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/99/`);

        assert.equal(currentRouteName(), 'registries.page-not-found', 'At page not found');
    });

    test('left nav controls', async function(this: DraftFormTestContext, assert) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const draftRegistration = server.create(
            'draft-registration', {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${draftRegistration.id}/`);
        await percySnapshot('Registries | Acceptance | draft form | left nav controls | metadata page');

        // Metadata page
        assert.equal(currentRouteName(), 'registries.drafts.draft.metadata', 'Starts at metadata route');
        assert.dom('[data-test-link="metadata"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'metadata is marked current page');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-circle', 'page 1 is marked unvisited');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-circle', 'page 2 is marked unvisited');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-metadata]').doesNotExist();
        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-register]').doesNotExist();

        // Navigate to second page
        await click('[data-test-link="2-this-is-the-second-page"]');
        await percySnapshot('Registries | Acceptance | draft form | left nav controls | second page');
        assert.equal(currentRouteName(), 'registries.drafts.draft.page', 'Goes to page route');
        assert.dom('[data-test-link="metadata"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'metadata is marked visited, invalid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-circle', 'page 1 is marked unvisited');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'page 2 is marked as current page');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-metadata]').doesNotExist();
        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.dom('[data-test-goto-next-page]').doesNotExist();
        assert.dom('[data-test-goto-review]').isVisible();
        assert.dom('[data-test-goto-register]').doesNotExist();

        // Navigate to first page
        await click('[data-test-link="1-first-page-of-test-schema"]');
        assert.dom('[data-test-link="metadata"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'metadata is marked visited, invalid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'page 1 is marked current page');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-check-circle-o', 'page 2 is marked visited, valid');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-metadata]').isVisible();
        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-register]').doesNotExist();

        // Navigate back to metadata
        await click('[data-test-link="metadata"]');
        assert.dom('[data-test-link="metadata"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'metadata is marked current again');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-check-circle-o', 'page 2 is marked visited, valid');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-metadata]').doesNotExist();
        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-register]').doesNotExist();

        // Navigate to review
        await click('[data-test-link="review"]');
        await percySnapshot('Registries | Acceptance | draft form | left nav controls | review page');
        assert.equal(currentRouteName(), 'registries.drafts.draft.review', 'Goes to review route');
        assert.dom('[data-test-link="metadata"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'metadata is marked visited, invalid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'page 1 is marked visited, invalid');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-check-circle-o', 'page 2 is marked visited, valid');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'review is marked current');
        assert.dom('[data-test-goto-metadata]').doesNotExist();
        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.dom('[data-test-goto-next-page]').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-register]').isVisible();
    });

    test('right sidenav controls', async function(this: DraftFormTestContext, assert) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        // Metadata page
        assert.equal(currentRouteName(), 'registries.drafts.draft.metadata', 'At metadata page');

        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-register]').doesNotExist();

        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-next-page]')!
            .includes(`/registries/drafts/${registration.id}/1-`));

        await click('[data-test-goto-next-page]');

        // First page of form
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/1-`), 'At first schema page');
        assert.dom('[data-test-goto-register]').doesNotExist();
        assert.dom('[data-test-goto-previous-page]').doesNotExist();

        assert.dom('[data-test-goto-metadata]').exists();
        assert.dom('[data-test-goto-next-page]').exists();

        await click('[data-test-goto-next-page]');

        // Second page of form
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/2-`), 'At second (last) page');
        assert.ok(getHrefAttribute('[data-test-goto-previous-page]')!
            .includes(`/registries/drafts/${registration.id}/1-`));

        assert.dom('[data-test-goto-register]').doesNotExist();
        assert.dom('[data-test-goto-metadata]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').doesNotExist();

        assert.dom('[data-test-goto-review]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-review]')!
            .includes(`/registries/drafts/${registration.id}/review`));

        await click('[data-test-goto-review]');

        // review page
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom('[data-test-read-only-response]').exists();

        assert.dom('[data-test-goto-metadata]').doesNotExist();
        assert.dom('data-test-goto-next-page').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();

        assert.dom('[data-test-goto-register]').isVisible();
        assert.dom('[data-test-goto-previous-page]').isVisible();

        // Can navigate back to the last page from review page
        await click('[data-test-goto-previous-page]');

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/2-`), 'At second (last) page');
    });

    test('mobile navigation works', async function(this: DraftFormTestContext, assert) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        setBreakpoint('mobile');

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/metadata`), 'At metadata page');
        await percySnapshot('Registries | Acceptance | draft form | mobile navigation | metadata page');

        // Check header
        assert.dom('[data-test-page-label]').containsText('Metadata');

        // Check next page arrow
        assert.dom('[data-test-goto-previous-page]').isNotVisible();
        assert.dom('[data-test-goto-next-page]').isVisible();
        await click('[data-test-goto-next-page]');

        // Check header
        assert.dom('[data-test-page-label]').containsText('First page of Test Schema');

        // Check next page arrow
        assert.dom('[data-test-goto-metadata]').isVisible();

        // Next page
        await click('[data-test-goto-next-page]');

        await percySnapshot('Registries | Acceptance | draft form | mobile navigation | second page');

        // Check that the header is expected
        assert.dom('[data-test-page-label]').containsText('This is the second page');

        // Check that left arrow exists
        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.dom('[data-test-goto-metadata]').isNotVisible();

        // Check navigation to review page
        await click('[data-test-goto-review]');

        await percySnapshot('Registries | Acceptance | draft form | mobile navigation | review page');
        assert.dom('[data-test-page-label]').containsText('Review');
        assert.dom('[data-test-goto-next-page]').isNotVisible();
        assert.dom('[data-test-goto-register]').isVisible();

        // check that register button is disabled
        assert.dom('[data-test-goto-register]').isDisabled();
        assert.dom('[data-test-invalid-responses-text]').isVisible();

        // Check that back button works
        await click('[data-test-goto-previous-page]');

        assert.dom('[data-test-page-label]').containsText('This is the second page');
    });

    test('register button is disabled: invalid responses', async function(this: DraftFormTestContext, assert) {
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
            'draft-registration',
            {
                registrationSchema,
                initiator,
                registrationResponses,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/review`);

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom('[data-test-goto-register]').isDisabled();
        assert.dom('[data-test-invalid-responses-text]').isVisible();
    });

    test('validations: errors show on review page', async function(this: DraftFormTestContext, assert) {
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
            'draft-registration',
            {
                registrationSchema,
                initiator,
                registrationResponses,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/review`);

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_short-text')}"]`).exists();
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_long-text')}"]`).doesNotExist();
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'page 1 is marked visited, invalid');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-check-circle-o', 'page 2 is marked visited, valid');
    });

    test('review: contributor can remove herself', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const branchedFrom = server.create('node');
        const draftRegistration = server.create('draft-registration',
            { registrationSchema, initiator: currentUser, branchedFrom });
        server.create('contributor', { users: currentUser, index: 0, draftRegistration });
        server.createList('contributor', 11, { draftRegistration });

        await visit(`/registries/drafts/${draftRegistration.id}/review`);

        assert.dom('a[data-test-contributor-name]').exists({ count: 10 }, 'shows 1 page of contributors');
        assert.dom('[data-test-load-more-contribs]').isVisible('x_more button is visible');
        assert.dom('[data-test-contributor-remove-me] > button').isVisible('remove me button is visible');
        await click('[data-test-contributor-remove-me] > button');

        assert.dom('.modal-content').isVisible('removeMe hard-confirm modal is visible');
        assert.dom('[data-test-confirm-delete]').isVisible('removeMe hard-confirm modal has confirm button');
        await percySnapshot(assert);

        await click('[data-test-confirm-delete]');
        assert.dom('#toast-container', document as unknown as Element).hasTextContaining(
            t('contributor_list.remove_contributor.success'),
            'Toast success message shows; has the right text',
        );

        await settled();
        assert.equal(currentURL(), '/dashboard', 'user is redirected to /dashboard');
    });

    test('metadata: read and write contributor can remove herself', async function(this: DraftFormTestContext, assert) {
        const currentUser = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const draftRegistration = server.create('draft-registration',
            {
                registrationSchema,
                initiator: currentUser,
                branchedFrom: this.branchedFrom,
            }, 'currentUserIsReadAndWrite');
        const thisContributor = server.create('contributor', {
            users: currentUser,
            index: 0,
            draftRegistration,
            permission: Permission.Write,
        });
        server.createList('contributor', 1, { draftRegistration });

        await visit(`/registries/drafts/${draftRegistration.id}/metadata`);
        assert.dom(`[data-test-contributor-remove-self="${thisContributor.id}"] > button`)
            .isVisible('remove me button is visible');
        await click(`[data-test-contributor-remove-self="${thisContributor.id}"] > button`);

        assert.dom('.modal-content').isVisible('removeMe hard-confirm modal is visible');
        assert.dom('[data-test-confirm-delete]').isVisible('removeMe hard-confirm modal has confirm button');
        await percySnapshot(assert);

        await click('[data-test-confirm-delete]');
        await settled();
        assert.equal(currentURL(), '/dashboard', 'user is redirected to /dashboard');
    });

    test('metadata: removeMe fails', async function(this: DraftFormTestContext, assert) {
        const currentUser = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const draftRegistration = server.create('draft-registration',
            {
                registrationSchema,
                initiator: currentUser,
                branchedFrom: this.branchedFrom,
            }, 'currentUserIsReadAndWrite');
        const thisContributor = server.create('contributor', {
            users: currentUser,
            index: 0,
            draftRegistration,
            permission: Permission.Write,
        });
        server.createList('contributor', 1, { draftRegistration });

        await visit(`/registries/drafts/${draftRegistration.id}/metadata`);
        assert.dom(`[data-test-contributor-remove-self="${thisContributor.id}"] > button`)
            .isVisible('remove me button is visible');
        await click(`[data-test-contributor-remove-self="${thisContributor.id}"] > button`);

        assert.dom('.modal-content').isVisible('removeMe hard-confirm modal is visible');
        assert.dom('[data-test-confirm-delete]').isVisible('removeMe hard-confirm modal has confirm button');

        server.namespace = '/v2';
        server.del('/draft_registrations/:parentID/contributors/:id', () => ({
            errors: [{ detail: 'Error occured' }],
        }), 400);

        await click('[data-test-confirm-delete]');
        const errorHeading = t('osf-components.contributors.removeContributor.errorHeading');
        const errorMessage = `${errorHeading}Error occured`;
        assert.dom('#toast-container', document as unknown as Element).hasTextContaining(
            stripHtmlTags(errorMessage.toString()),
            'Toast error message shows; has the right text',
        );
    });

    test('review: removeMe fails', async function(this: DraftFormTestContext, assert) {
        const currentUser = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const users = server.createList('user', 10);
        const draftRegistration = server.create('draft-registration',
            {
                branchedFrom: this.branchedFrom,
                registrationSchema,
                initiator: currentUser,
            });

        users.forEach((user, index) => {
            server.create('contributor', { users: user, index, draftRegistration });
        });
        const currentUserContrib = server.create('contributor',
            { id: currentUser.id, users: currentUser, index: 10, draftRegistration });

        await visit(`/registries/drafts/${draftRegistration.id}/review`);

        assert.dom('a[data-test-contributor-name]').exists({ count: 10 }, 'shows 1 page of contributors');
        assert.dom('[data-test-load-more-contribs]')
            .hasText(t('contributor_list.x_more', { x: 1 }), '1 more contributor left to load.');
        assert.dom(`[data-test-contributor-name=${currentUserContrib.users.id}]`).doesNotExist();
        assert.dom('[data-test-contributor-remove-me] > button').isVisible('remove me button is visible');

        server.namespace = '/v2';
        server.del('/draft_registrations/:parentID/contributors/:id', () => ({
            errors: [{ detail: 'Error occured' }],
        }), 400);

        await click('[data-test-contributor-remove-me] > button');

        assert.dom('.modal-content').isVisible('removeMe hard-confirm modal is visible');
        assert.dom('[data-test-confirm-delete]').isVisible('removeMe hard-confirm modal has confirm button');

        await click('[data-test-confirm-delete]');
        const { supportEmail } = config.support;
        const errorMessage = t('contributor_list.remove_contributor.error', { supportEmail, htmlSafe: true });
        assert.dom('#toast-container', document as unknown as Element).hasTextContaining(
            stripHtmlTags(errorMessage.toString()),
            'Toast error message shows; has the right text',
        );

        await settled();
        assert.dom('[data-test-load-more-contribs]')
            .isNotVisible('An additional contributor (currentUser) was loaded, none left');
        assert.equal(currentRouteName(), 'registries.drafts.draft.review', 'no redirect on remove error');
    });

    test('validations: cannot register with empty registrationResponses', async function(
        this: DraftFormTestContext, assert,
    ) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        await click('[data-test-link="review"]');

        assert.dom('[data-test-goto-register]').isDisabled();
        assert.dom('[data-test-invalid-responses-text]').isVisible();
    });

    test(
        'Project-based registration: partial and finalize registration modal show, can register draft',
        async assert => {
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
                'draft-registration',
                {
                    registrationSchema,
                    initiator,
                    registrationResponses,
                    branchedFrom: rootNode,
                    currentUserPermissions: Object.values(Permission),
                    license: server.schema.licenses.first(),
                },
            );
            const subjects = [server.create('subject')];
            registration.update({ subjects });
            await visit(`/registries/drafts/${registration.id}/review`);

            assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
            assert.dom('[data-test-goto-register]').isNotDisabled();

            await click('[data-test-goto-register]');

            // PartialRegistrationModal
            assert.dom('#osf-dialog-heading').hasText(t('registries.partialRegistrationModal.title').toString());
            [
                rootNode, childNode, grandChildNode,
            ].mapBy('id').forEach(id => assert.dom(`[data-test-expand-child="${id}"]`));
            await click('[data-test-cancel-registration-button]');

            assert.dom('#osf-dialog-heading').isNotVisible('cancel closes the modal');

            await click('[data-test-goto-register]');

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

            assert.equal(currentRouteName(), 'registries.overview.index', 'Redicted to new registration overview page');
        },
    );

    test(
        'No-project registration: only finalize registration modal show, can register draft',
        async assert => {
            const initiator = server.create('user', 'loggedIn');
            const registrationSchema = server.schema.registrationSchemas.find('testSchema');
            const draftNode = server.create('draft-node');
            const registrationResponses = {
                'page-one_long-text': '',
                'page-one_multi-select': [],
                'page-one_multi-select-other': '',
                'page-one_short-text': 'ditto',
                'page-one_single-select': 'tuna',
                'page-one_single-select-two': '',
            };
            const registration = server.create(
                'draft-registration',
                {
                    registrationSchema,
                    initiator,
                    registrationResponses,
                    branchedFrom: draftNode,
                    currentUserPermissions: Object.values(Permission),
                    license: server.schema.licenses.first(),
                    hasProject: false,
                },
            );
            const subjects = [server.create('subject')];
            registration.update({ subjects });
            await visit(`/registries/drafts/${registration.id}/review`);

            assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
            assert.dom('[data-test-goto-register]').isNotDisabled();

            await click('[data-test-goto-register]');
            // FinalizeRegistrationModal
            assert.dom('#osf-dialog-heading').hasText(t('registries.finalizeRegistrationModal.title').toString());
            assert.dom('[data-test-submit-registration-button]').isDisabled();

            await click('[data-test-immediate-button]');
            assert.dom('[data-test-submit-registration-button]').isNotDisabled();

            await click('[data-test-submit-registration-button]');

            assert.equal(currentRouteName(), 'registries.overview.index', 'Redicted to new registration overview page');
        },
    );

    test('validations: marks all pages (visited or unvisited) as visited and validates all in review', async function(
        this: DraftFormTestContext, assert,
    ) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/2`);

        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'current page, not validated');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-circle', 'page 1 is unvisited, not validated');

        await click('[data-test-goto-review]');

        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-check-circle-o', 'page 2 is marked visited, valid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'page 1 is marked visited, invalid');
    });

    test('validations: validates all visited pages upon current page load', async function(
        this: DraftFormTestContext, assert,
    ) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/1`);

        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'page 1 is current page');

        await click('[data-test-goto-next-page]');

        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'page 2 is current page');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'page 1 is validated, invalid');
    });

    test('validations: validations status updates properly on metadata page', async function(
        this: DraftFormTestContext, assert,
    ) {
        const provider = server.schema.registrationProviders.find('osf');
        provider.update({
            subjects: server.createList('subject', 10, 'withChildren'),
        });
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/metadata`);

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/metadata`), 'At metadata page');
        assert.dom('[data-test-validation-errors="title"]').doesNotExist('no errors for title on first load');
        assert.dom('[data-test-validation-errors="description"]')
            .doesNotExist('no errors for description on first load');

        // Error for empty title, no error for description
        await fillIn('textarea[name="description"]', 'The most dangerous game');
        await fillIn('input[name="title"]', '');
        assert.dom('[data-test-validation-errors="title"]').exists('error in title after filling in empty string');
        assert.dom('[data-test-validation-errors="description"]')
            .doesNotExist('no error in description after valid string');

        // Error fixed for title, error introduced for description
        await fillIn('input[name="title"]', 'Skiball');
        await fillIn('textarea[name="description"]', '');
        assert.dom('[data-test-validation-errors="title"]')
            .doesNotExist('error in title goes away after filling in valid string');
        assert.dom('[data-test-validation-errors="description"]')
            .exists('error in description appears after removing valid string to blank string');

        // Choose category and add a tag
        await click('[data-test-metadata-category] > div');
        await percySnapshot('Registries | Acceptance | draft form | metadata editing | metadata: categories opened');
        assert.dom('[data-option-index="1"]').containsText('Other');
        await click('[data-option-index="1"]');

        await click('[data-test-metadata-tags]');
        await fillIn('[data-test-metadata-tags] input', 'ragtagbag');
        await triggerKeyEvent('[data-test-metadata-tags] input', 'keydown', 'Enter');

        // No errors for nodelicense fields
        assert.dom('[data-test-validation-errors="subjects"]')
            .doesNotExist('no error for required fields that user has yet to change: subjects');
        assert.dom('[data-test-validation-errors="license"]')
            .doesNotExist('no error for required fields that user has yet to change: license');

        // Validation errors exist on review page
        await click('[data-test-link="review"]');

        assert.dom('[data-test-link="metadata"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'metadata page is marked invalid');
        assert.dom('[data-test-goto-register]').isDisabled();
        assert.dom('[data-test-validation-errors="subjects"]');
        assert.dom('[data-test-validation-errors="license"]');

        // Category and tag added appear on review page
        assert.dom('[data-test-review-response="category"]')
            .containsText('Other', 'category that was selected in metadata page shows up in review');
        assert.dom('[data-test-tags-widget-tag="ragtagbag"]')
            .exists('tag added in metadata shows up in review page');

        // Return to Metadata page and address errors for subjects and license
        await click('[data-test-link="metadata"]');

        assert.dom('[data-test-validation-errors="subjects"]')
            .exists('error appears for unedited, required fields after returning to metadata page: subjects');
        assert.dom('[data-test-validation-errors="license"]')
            .exists('error appears for unedited, required fields after returning to metadata page: license');

        // Choose a subject
        await click('[data-test-subject="1"] > input');
        assert.dom('[data-test-validation-errors="subjects"]')
            .doesNotExist('validation error for subjects gone when user makes a selection');

        // Choose a license
        await click('[data-test-select-license] > .ember-basic-dropdown-trigger');
        await percySnapshot('Registries | Acceptance | draft form | metadata editing | metadata: licenses opened');
        assert.dom('[data-option-index="2"]').containsText('MIT License');
        await click('[data-option-index="2"]'); // This should be MIT License which requires Year and Copyright Holder
        assert.dom('[data-test-required-field="year"]')
            .hasValue(new Date().getUTCFullYear().toString(), 'License: Year autofills to current year');
        assert.dom('[data-test-required-field="copyrightHolders"]')
            .hasText('', 'License: CopyrightHolders does not autofill');
        let missingFields = 'Copyright Holders';
        let validationErrorMsg = t('validationErrors.node_license_missing_fields',
            { missingFields, numOfFields: 1 }).toString();
        assert.dom('[data-test-validation-errors="nodeLicense"]')
            .containsText(validationErrorMsg, 'NodeLicense validation error when copyright holder is empty');

        // Input invalid Nodelicense fields
        await fillIn('[data-test-required-field="year"]', '');
        missingFields = 'Year, Copyright Holders';
        validationErrorMsg = t('validationErrors.node_license_missing_fields',
            { missingFields, numOfFields: 2 }).toString();
        assert.dom('[data-test-validation-errors="nodeLicense"]')
            .containsText(validationErrorMsg, 'NodeLicense validation error when year and copyrightholder are empty');
        await percySnapshot('Registries | Acceptance | draft form | metadata editing | metadata: invalid nodelicense');

        // validation errors for nodelicense should show on review page
        await click('[data-test-link="review"]');

        assert.dom('[data-test-validation-errors="nodeLicense"]').exists('NodeLicense errors exist on Review page');
        await percySnapshot('Registries | Acceptance | draft form | metadata editing | review: invalid nodelicense');

        // Return to metadata page to address empty fields
        await click('[data-test-link="metadata"]');

        await fillIn('[data-test-required-field="year"]', '2222');
        await fillIn('[data-test-required-field="copyrightHolders"]', 'Twice and BlackPink');
        assert.dom('[data-test-validation-errors="nodeLicense"]')
            .doesNotExist('NodeLicense validation errrors gone when year and license holders are filled in');

        // NodeLicense fields appear on review page
        await click('[data-test-link="review"]');

        assert.dom('[data-test-review-label="nodeLicense.year"]')
            .exists('NodeLicense: year fields exist on Review page');
        assert.dom('[data-test-review-label="nodeLicense.copyrightHolders"]')
            .exists('NodeLicense: copyrightHolder fields exist on Review page');

        // Choose a license that does not require either year or copyright holder
        await click('[data-test-link="metadata"]');

        await click('[data-test-select-license] > .ember-basic-dropdown-trigger');
        assert.dom('[data-option-index="1"]').containsText('General Public License');
        await click('[data-option-index="1"]'); // This should be General Public which does not require any fields
        assert.dom('[data-test-required-field="year"]')
            .doesNotExist('year field does not display on a license that does not require it');
        assert.dom('[data-test-required-field="copyrightHolders"]')
            .doesNotExist('copyright holders field does not display on a license that does not require it');
    });

    test('Contributor with write permissions can delete files/folder', async assert => {
        const time = new TimeControl();
        // Speed up ember-animated animations by 100x
        time.runAtSpeed(100);

        const initiator = server.create('user', 'loggedIn');
        const openEndedReg = server.schema.registrationSchemas.find('open_ended_registration');
        const branchedFrom = server
            .create('node', { currentUserPermissions: [Permission.Read, Permission.Write] });
        const fileOne = server.create('file', { target: branchedFrom });
        const fileTwo = server.create('file', { target: branchedFrom });
        const folderOne = server.create('file', { target: branchedFrom }, 'asFolder');
        const [folderOneFileOne, folderOneFileTwo] = server
            .createList('file', 2, { target: branchedFrom, parentFolder: folderOne });

        const registrationResponses = {
            summary: 'Test file links',
            uploader: [fileOne.fileReference, folderOneFileOne.fileReference, folderOneFileTwo.fileReference],
        };
        const osfstorage = server.create('file-provider', { target: branchedFrom });
        osfstorage.rootFolder.update({
            files: [fileOne, fileTwo, folderOne],
        });

        const draftRegistration = server.create('draft-registration', {
            registrationSchema: openEndedReg,
            registrationResponses,
            branchedFrom,
            initiator,
        });

        await visit(`/registries/drafts/${draftRegistration.id}/`);
        await click('[data-test-goto-next-page]');

        assert.dom(`[data-test-delete-file="${fileOne.id}"] > button`)
            .isVisible('fileOne row has a delete button');
        assert.dom(`[data-test-delete-file="${fileTwo.id}"] > button`)
            .isVisible('fileTwo has has a delete button');

        assert.dom(`[data-test-selected-file="${fileOne.id}"]`)
            .exists('fileOne is selected (attached as a registration response)');
        await click(`[data-test-delete-file="${fileOne.id}"] > button`);

        assert.dom('.modal-content').isVisible('file delete hard-confirm modal is visible');
        assert.dom('[data-test-confirm-delete]')
            .isVisible('file delete hard-confirm modal has a confirm button');
        await click('[data-test-confirm-delete]');

        assert.dom(`[data-test-file-name="${fileOne.itemName}"]`)
            .doesNotExist('fileOne has been deleted from the draft');
        assert.dom(`[data-test-selected-file="${fileOne.id}"]`)
            .doesNotExist('fileOne is no longer selected');
        assert.notOk(server.schema.files.findBy({ id: fileOne.id }), 'fileOne is deleted from the db');

        // folder deletion
        assert.dom(`[data-test-delete-file="${folderOne.id}"] > button`)
            .doesNotExist('folderOne has no delete button');
        await click(`[data-test-file-browser-item="${folderOne.id}"]`);
        await animationsSettled();

        assert.dom(`[data-test-delete-current-folder="${folderOne.id}"] > button`)
            .isVisible('folderOne has a delete button');
        assert.dom('[data-test-file-browser-item]')
            .exists({ count: 3 }, 'folderOne contains two visible files');
        assert.dom(`[data-test-selected-file="${folderOneFileOne.id}"]`)
            .isVisible('folderOneFileOne is selected');
        assert.dom(`[data-test-selected-file="${folderOneFileTwo.id}"]`)
            .isVisible('folderOneFileTwo is selected');

        await click(`[data-test-delete-current-folder="${folderOne.id}"] > button`);
        assert.dom('[data-test-confirm-delete]')
            .isVisible('folder delete hard-confirm modal has a confirm button');
        await click('[data-test-confirm-delete]');

        assert.dom('#toast-container', document as unknown as Element).hasTextContaining(
            t('osf-components.files-widget.delete_success', { filename: folderOne.itemName }),
            'Toast success message shows; folderOne succesfully deleted',
        );

        await settled();
        assert.dom(`[data-test-file-browser-item="${folderOne.id}"]`)
            .doesNotExist('folderOne no longer shows in the parent folder view');
        assert.dom(`[data-test-selected-file="${folderOneFileOne.id}"]`)
            .isVisible('folderOneFileOne is no longer selected.'
            + 'Deleting a folder unselect any of its selected descendants');
        assert.dom(`[data-test-selected-file="${folderOneFileTwo.id}"]`)
            .isVisible('folderOneFileTwo is no longer selected.'
            + 'Deleting a folder unselect any of its selected descendants');

        // test file deletion fails
        server.namespace = '/wb';
        server.del('/files/:id/delete', () => ({
            errors: [{ detail: 'Error occured' }],
        }), 400);
        assert.dom(`[data-test-file-browser-item="${fileTwo.id}"]`).isVisible('fileTwo is visible');
        await click(`[data-test-delete-file="${fileTwo.id}"] > button`);
        await click('[data-test-confirm-delete]');
        assert.dom('#toast-container', document as unknown as Element).hasTextContaining(
            t('osf-components.files-widget.delete_failed', { filename: fileTwo.itemName }),
            'Toast error message shows; has the right text',
        );
        assert.dom(`[data-test-file-browser-item="${fileTwo.id}"]`).isVisible('fileTwo is still visible');
    });

    test('validations: validations status changes as user fixes/introduces errors', async function(
        this: DraftFormTestContext, assert,
    ) {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
                branchedFrom: this.branchedFrom,
            },
        );

        await visit(`/registries/drafts/${registration.id}/1`);

        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-circle-o', 'on page 1');

        // should validate pages even without user input
        await click('[data-test-goto-next-page]');

        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'page 1 is invalid');

        await click('[data-test-goto-review]');

        const shortTextKey = deserializeResponseKey('page-one_short-text');
        assert.dom(`[data-test-validation-errors="${shortTextKey}"]`)
            .exists('page-one_short-text has validation errors on review page');

        await click('[data-test-link="1-first-page-of-test-schema"]');

        assert.dom(`[data-test-validation-errors="${shortTextKey}"]`)
            .exists('page-one_short-text has validation errors when empty');
        await fillIn(`input[name="${shortTextKey}"]`, 'ditto');
        assert.dom(`[data-test-validation-errors="${shortTextKey}"]`)
            .doesNotExist('page-one_short-text has no validation errors with non-empty string');

        await click('[data-test-goto-metadata]');

        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-check-circle-o', 'page 1 is now valid');
    });
});

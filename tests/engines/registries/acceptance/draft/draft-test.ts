import Service from '@ember/service';
import { click, currentRouteName, currentURL, fillIn, settled, triggerKeyEvent } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { deserializeResponseKey } from 'ember-osf-web/transforms/registration-response-key';

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
        server.loadFixtures('registration-providers');
        server.loadFixtures('licenses');
    });

    test('it redirects to metadata page of the draft form', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        assert.equal(currentRouteName(), 'registries.drafts.draft.metadata', 'At the expected route');
    });

    test('it redirects page-not-found if the pageIndex route param is out of range', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', {
                registrationSchema,
                initiator,
            },
        );

        await visit(`/registries/drafts/${registration.id}/99/`);

        assert.equal(currentRouteName(), 'registries.page-not-found', 'At page not found');
    });

    test('left nav controls', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', {
                registrationSchema,
                initiator,
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);
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

    test('right sidenav controls', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
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

    test('mobile navigation works', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
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
            'draft-registration',
            {
                registrationSchema,
                initiator,
                registrationResponses,
            },
        );

        await visit(`/registries/drafts/${registration.id}/review`);
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom('[data-test-goto-register]').isDisabled();
        assert.dom('[data-test-invalid-responses-text]').isVisible();
    });

    test('validations: errors show on review page', async assert => {
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

    test('validations: cannot register with empty registrationResponses', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
            },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        await click('[data-test-link="review"]');

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
            'draft-registration',
            {
                registrationSchema,
                initiator,
                registrationResponses,
                branchedFrom: rootNode,
                license: server.schema.licenses.first(),
            },
        );
        const subjects = [server.create('subject')];
        registration.update({ subjects });
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

    test('validations: marks all pages (visited or unvisited) as visited and validates all in review', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
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

    test('validations: validates all visited pages upon current page load', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
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

    test('validations: validations status updates properly on metadata page', async assert => {
        server.loadFixtures('subjects');

        server.createList('subject', 10, 'withChildren');
        const provider = server.schema.registrationProviders.find('osf');
        provider.update({
            subjects: server.schema.subjects.all().models,
        });

        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
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

    test('validations: validations status changes as user fixes/introduces errors', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
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

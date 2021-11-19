import Service from '@ember/service';
import {
    click,
    currentRouteName,
    currentURL,
    fillIn,
    find,
} from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext, t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { module, test } from 'qunit';

import { getHrefAttribute, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { Permission } from 'ember-osf-web/models/osf-model';
import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { deserializeResponseKey } from 'ember-osf-web/transforms/registration-response-key';

const currentUserStub = Service.extend();
const storeStub = Service.extend();

interface RevisionTestContext extends TestContext {
    registration: ModelInstance<RegistrationModel>;
    provider: ModelInstance<RegistrationProviderModel>;
    registrationSchema: ModelInstance<RegistrationSchemaModel>;
}

module('Registries | Acceptance | registries revision', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: RevisionTestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:store', storeStub);
        this.provider = server.create('registration-provider', {
            id: 'test',
            name: 'Test Provider',
        });

        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        this.registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            provider: this.provider,
            registrationSchema,
        });
    });

    test('it redirects to overview page is the provider does not allow updates', async function(
        this: RevisionTestContext, assert,
    ) {
        const initiatedBy = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        this.provider.allowUpdates = false;
        const revision = server.create(
            'schema-response',
            {
                registrationSchema,
                initiatedBy,
                revisionResponses: {},
                registration: this.registration,
            },
        );
        await visit(`/registries/revisions/${revision.id}/`);
        assert.equal(currentRouteName(), 'registries.overview.index',
            'Providers not allowing updates redirects to overview');
    });

    test('it redirects to overview page if the revision is already public', async function(
        this: RevisionTestContext, assert,
    ) {
        const initiatedBy = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const revision = server.create(
            'schema-response',
            {
                registrationSchema,
                initiatedBy,
                revisionResponses: {},
                reviewsState: RevisionReviewStates.Approved,
                registration: this.registration,
            },
        );

        await visit(`/registries/revisions/${revision.id}/`);
        assert.equal(currentRouteName(), 'registries.overview.index', 'Approved revisions cannot be edited');
    });

    test('it redirects to review page of the update form for read-only users', async function(
        this: RevisionTestContext, assert,
    ) {
        const initiatedBy = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        this.registration.currentUserPermissions = [Permission.Read];
        const revision = server.create(
            'schema-response',
            {
                registrationSchema,
                initiatedBy,
                revisionResponses: {},
                registration: this.registration,
            },
        );

        await visit(`/registries/revisions/${revision.id}/`);
        assert.equal(currentRouteName(), 'registries.edit-revision.review',
            'Read-only users redirected to review page');

        // check leftnav
        const reviewNav = find('[data-test-link="review"]');
        assert.dom('[data-test-link="justification"]')
            .doesNotExist('Leftnav: Label for justification page is not shown');
        assert.dom('[data-test-link="1-first-page-of-test-schema"]')
            .doesNotExist('Leftnav: Label for first page is not shown');
        assert.dom('[data-test-link="review"]').exists('Leftnav: Review label shown');
        assert.ok(reviewNav!.classList.toString().includes('Active'), 'LeftNav: Review is active page');

        // check rightnav
        assert.dom('[data-test-submit-revision]').doesNotExist('RightNav: Register button not shown');
        assert.dom('[data-test-nonadmin-warning-text]').exists('RightNav: Warning non-admins cannot register shown');
        assert.dom('[data-test-goto-previous-page]').doesNotExist('RightNav: Back button not shown');
        assert.dom('[data-test-delete-button]').doesNotExist('RightNav: Delete button not shown');

        // check form renderer
        await percySnapshot('Read-only Revision Review page: Desktop');

        // check mobile view
        setBreakpoint('mobile');
        await visit(`/registries/revisions/${revision.id}/1-first-page-of-test-schema`);
        assert.equal(currentRouteName(), 'registries.edit-revision.review',
            'Read-only users redirected to review page after trying to go to the first page');

        assert.dom('[data-test-sidenav-toggle]').doesNotExist('Mobile view: sidenav toggle not shown');
        assert.dom('[data-test-goto-previous-page]').doesNotExist('Mobile view: previous page button not shown');
        assert.dom('[data-test-nonadmin-warning-text]').exists('Mobile view: Warning non-admins cannot register shown');
        assert.dom('[data-test-submit-revision]').doesNotExist('Mobile view: Register button does not exist');

        await percySnapshot('Read-only Revision Review page: Mobile');
    });

    test('it redirects to the justification page of revision form', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        const revision = server.create(
            'schema-response',
            {
                initiatedBy,
                revisionResponses: {},
                registration: this.registration,
            },
        );
        await visit(`/registries/revisions/${revision.id}/`);
        assert.equal(currentRouteName(), 'registries.edit-revision.justification', 'At the expected route');
    });

    test('delete revision in progress', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        const revision = server.create(
            'schema-response',
            {
                initiatedBy,
                revisionResponses: {},
                registration: this.registration,
            },
        );
        await visit(`/registries/revisions/${revision.id}/`);
        assert.equal(currentRouteName(), 'registries.edit-revision.justification', 'At the expected route');
        await click('[data-test-delete-button]');
        assert.equal(currentRouteName(), 'registries.overview.index', 'At the expected route');
    });

    test('left nav controls', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        const revision = server.create(
            'schema-response', {
                initiatedBy,
                revisionResponses: {},
                registration: this.registration,
            },
        );

        await visit(`/registries/revisions/${revision.id}/`);
        await percySnapshot('Registries | Acceptance | registries revision | left nav controls | justification page');

        // justification page
        assert.equal(currentRouteName(), 'registries.edit-revision.justification', 'Starts at justification page');
        assert.dom('[data-test-link-back-to-registration]').exists('Link back to registration is shown');
        assert.dom('[data-test-link="justification"] > [data-test-icon]')
            .hasClass('fa-dot-circle', 'justification page is current page');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-circle', 'page 1 is marked unvisited');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-submit-revision]').doesNotExist();

        // first page
        await click('[data-test-link="1-first-page-of-test-schema"]');
        await percySnapshot('Registries | Acceptance | registries revision | left nav controls | first page');
        assert.equal(currentRouteName(), 'registries.edit-revision.page', 'Starts at first page');
        assert.dom('[data-test-link="justification"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'justification page is marked visited, invalid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-dot-circle', 'page 1 is current page');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-circle', 'page 2 is marked unvisited');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-submit-revision]').doesNotExist();

        await click('[data-test-link="2-this-is-the-second-page"]');
        await percySnapshot('Registries | Acceptance | registries revision | left nav controls | second page');
        assert.equal(currentRouteName(), 'registries.edit-revision.page', 'Goes to second page');
        assert.dom('[data-test-link="justification"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'justification page is marked visited, invalid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'page 1 is marked visited, invalid');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-dot-circle', 'page 2 is marked as current page');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.dom('[data-test-goto-next-page]').doesNotExist();
        assert.dom('[data-test-goto-review]').isVisible();
        assert.dom('[data-test-submit-revision]').doesNotExist();

        // Navigate to first page
        await click('[data-test-link="1-first-page-of-test-schema"]');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-dot-circle', 'page 1 is marked current page');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-check-circle', 'page 2 is marked visited, valid');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-circle', 'review is marked unvisited');
        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-submit-revision]').doesNotExist();

        // Navigate to review
        await click('[data-test-link="review"]');
        await percySnapshot('Registries | Acceptance | registries revision | left nav controls | review page');
        assert.equal(currentRouteName(), 'registries.edit-revision.review', 'Goes to review route');
        assert.dom('[data-test-link="justification"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'justification page is marked visited, invalid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'page 1 is marked visited, invalid');
        assert.dom('[data-test-link="2-this-is-the-second-page"] > [data-test-icon]')
            .hasClass('fa-check-circle', 'page 2 is marked visited, valid');
        assert.dom('[data-test-link="review"] > [data-test-icon]')
            .hasClass('fa-dot-circle', 'review is marked current');
        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.dom('[data-test-goto-next-page]').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-submit-revision]').isVisible();
    });

    test('right sidenav controls', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        const revision = server.create(
            'schema-response',
            {
                initiatedBy,
                revisionResponses: {},
                registration: this.registration,
            },
        );

        await visit(`/registries/revisions/${revision.id}/`);


        // Justification page
        assert.equal(currentRouteName(), 'registries.edit-revision.justification', 'At justification page');
        assert.dom('[data-test-submit-revision]').doesNotExist();
        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-justification]').doesNotExist();

        assert.dom('[data-test-goto-next-page]').exists();
        assert.ok(getHrefAttribute('[data-test-goto-next-page]')!
            .includes(`/registries/revisions/${revision.id}/1-`));

        await click('[data-test-goto-next-page]');

        // First page of form
        assert.ok(currentURL().includes(`/registries/revisions/${revision.id}/1-`),
            'At first schema page');
        assert.dom('[data-test-submit-revision]').doesNotExist();
        assert.dom('[data-test-goto-previous-page]').doesNotExist();

        assert.dom('[data-test-goto-justification]').exists();
        assert.dom('[data-test-goto-next-page]').exists();
        assert.ok(getHrefAttribute('[data-test-goto-next-page]')!
            .includes(`/registries/revisions/${revision.id}/2-`));

        await click('[data-test-goto-next-page]');

        // Second page of form
        assert.ok(currentURL().includes(`/registries/revisions/${revision.id}/2-`),
            'At second (last) page');
        assert.ok(getHrefAttribute('[data-test-goto-previous-page]')!
            .includes(`/registries/revisions/${revision.id}/1-`));

        assert.dom('[data-test-submit-revision]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').doesNotExist();
        assert.dom('[data-test-goto-justification]').doesNotExist();

        assert.dom('[data-test-goto-review]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-review]')!
            .includes(`/registries/revisions/${revision.id}/review`));

        await click('[data-test-goto-review]');

        // review page
        assert.ok(currentURL().includes(`/registries/revisions/${revision.id}/review`), 'At review page');
        assert.dom('[data-test-read-only-response]').exists();

        assert.dom('data-test-goto-next-page').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-justification]').doesNotExist();

        assert.dom('[data-test-submit-revision]').isVisible();
        assert.dom('[data-test-nonadmin-warning-text]').doesNotExist('Warning for non-admins not shown to admins');
        assert.dom('[data-test-goto-previous-page]').isVisible();

        // Can navigate back to the last page from review page
        await click('[data-test-goto-previous-page]');

        assert.ok(currentURL().includes(`/registries/revisions/${revision.id}/2-`), 'At second (last) page');
    });

    test('mobile navigation works', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        const revision = server.create(
            'schema-response', {
                initiatedBy,
                revisionResponses: {},
                registration: this.registration,
            },
        );

        await visit(`/registries/revisions/${revision.id}/`);

        setBreakpoint('mobile');


        // Justification page
        assert.equal(currentRouteName(), 'registries.edit-revision.justification', 'At justification page');
        await percySnapshot('Registries | Acceptance | registries revision | mobile nav controls | justification page');
        assert.dom('[data-test-page-label]').containsText('Justification');
        assert.dom('[data-test-goto-previous-page]').isNotVisible();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-submit-revision]').doesNotExist();
        assert.dom('[data-test-goto-justification]').doesNotExist();
        await click('[data-test-goto-next-page]');

        // First page
        assert.ok(currentURL().includes(`/registries/revisions/${revision.id}/1-`), 'At first page');
        await percySnapshot('Registries | Acceptance | registries revisions | mobile navigation | first page');
        assert.dom('[data-test-page-label]').containsText('First page');
        assert.dom('[data-test-goto-previous-page]').isNotVisible();
        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.dom('[data-test-goto-justification]').exists();
        assert.dom('[data-test-submit-revision]').doesNotExist();
        await click('[data-test-goto-next-page]');

        // Second page
        await percySnapshot('Registries | Acceptance | registries revisions | mobile navigation | second page');
        assert.dom('[data-test-page-label]').containsText('This is the second page');
        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.dom('[data-test-goto-next-page]').isNotVisible();
        assert.dom('[data-test-goto-review]').isVisible();
        assert.dom('[data-test-goto-justification]').doesNotExist();
        assert.dom('[data-test-submit-revision]').doesNotExist();

        // Review page
        await click('[data-test-goto-review]');

        await percySnapshot('Registries | Acceptance | registries revisions | mobile navigation | review page');
        assert.dom('[data-test-page-label]').containsText('Review');
        assert.dom('[data-test-goto-next-page]').isNotVisible();
        assert.dom('[data-test-nonadmin-warning-text]').doesNotExist('Warning for non-admins not shown to admins');
        assert.dom('[data-test-submit-revision]').isVisible();

        // check that register button is disabled
        assert.dom('[data-test-submit-revision]').isDisabled();
        assert.dom('[data-test-invalid-responses-text]').isVisible();

        // Check that back button works
        await click('[data-test-goto-previous-page]');

        assert.dom('[data-test-page-label]').containsText('This is the second page');
    });

    // TODO: investigate why validation status doesn't update when we have responses defined in the revision
    // Seems to be an issue only when using mirage?
    test('correcting invalid responses', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        const revision = server.create(
            'schema-response',
            {
                initiatedBy,
                registration: this.registration,
                revisionResponses: {},
            },
        );

        await visit(`/registries/revisions/${revision.id}`);

        assert.equal(currentRouteName(), 'registries.edit-revision.justification', 'At justification page');
        assert.dom('[data-test-validation-errors="revisionJustification"]')
            .doesNotExist('No validation errors on first load');
        await click('[data-test-goto-next-page]');

        // check first page is not invalid
        assert.ok(currentURL().includes(`/registries/revisions/${revision.id}/1-`),
            'At first page');
        assert.dom('[data-test-link="justification"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'justification page is marked visited, invalid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-dot-circle', 'on page 1');
        // NOTE: the validation errors are shown if we enter the first page having done either the
        // route.replaceWith from edit-revision.index (/revisions/:id),
        // or the controller.replaceRoute from edit-revision.page (/revisions/:id/:page)
        // Validation errors are not shown if entering with the pageslug appended (/revisions/:id/:page-page-slug)
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_short-text')}"]`)
            .doesNotExist('Validation message not shown on initial load');

        await click('[data-test-link="review"]');
        assert.equal(currentRouteName(), 'registries.edit-revision.review', 'At review page');
        assert.dom('[data-test-submit-revision]').isDisabled('Submit button disabled');
        assert.dom('[data-test-nonadmin-warning-text]').doesNotExist('Warning for non-admins not shown to admins');
        assert.dom('[data-test-invalid-responses-text]').isVisible('Invalid response text shown');

        assert.dom('[data-test-validation-errors="revisionJustification"]').exists('justification invalid');
        assert.dom('[data-test-validation-errors="updatedResponseKeys"]').exists('revised responses invalid');
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_short-text')}"]`)
            .exists('short text invalid');
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_long-text')}"]`)
            .doesNotExist('long text valid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-exclamation-circle', 'first page invalid');

        // hack since we don't actually track which fields have been updated in mirage
        revision.update({ updatedResponseKeys: ['page-one_short-text'] });
        // check the first page and correct invalid answer
        await click('[data-test-link="1-first-page-of-test-schema"]');
        assert.ok(currentURL().includes(`/registries/revisions/${revision.id}/1-`),
            'At first page');
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_short-text')}"]`)
            .exists('short text invalid before fixing');
        await fillIn(`input[name="${deserializeResponseKey('page-one_short-text')}"]`, 'ditto');
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_short-text')}"]`)
            .doesNotExist('short text valid after being filled');

        // check justification page and fix invalid answer
        await click('[data-test-link="justification"]');
        await fillIn('textarea[name="revisionJustification"]', 'Tell the world that ditto is the best');
        assert.dom('[data-test-validation-errors="revisionJustification"]').doesNotExist('justification valid');
        assert.dom('[data-test-revised-responses-list]').exists({ count: 1 }, 'revised responses list shown');

        // check the review page to see if text is valid again
        await click('[data-test-link="review"]');
        assert.dom('[data-test-link="justification"] > [data-test-icon]')
            .hasClass('fa-check-circle', 'justification page is now valid');
        assert.dom('[data-test-link="1-first-page-of-test-schema"] > [data-test-icon]')
            .hasClass('fa-check-circle', 'first page now valid');
        assert.dom('[data-test-validation-errors="revisionJustification"]').doesNotExist('justification valid');
        assert.dom('[data-test-validation-errors="updatedResponseKeys"]').doesNotExist('revised responses valid');
        assert.dom(`[data-test-validation-errors="${deserializeResponseKey('page-one_short-text')}"]`)
            .doesNotExist('short text now valid');
        assert.dom('[data-test-submit-revision]').isNotDisabled('Submit button no longer disabled');
    });

    test('Submit, continue edit, and resubmit', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        const revision = server.create(
            'schema-response',
            {
                initiatedBy,
                revisionResponses: {
                    'page-one_short-text': 'Pekatyu',
                },
                registration: this.registration,
                updatedResponseKeys: ['page-one_short-text'],
                revisionJustification: 'If pikachu were russian',
            },
        );

        await visit(`/registries/revisions/${revision.id}/review`);
        await click('[data-test-submit-revision]');
        assert.dom('#toast-container', document as any).hasTextContaining(t(
            'registries.edit_revision.review.action_submit_success',
        ), 'Toast message shown after initial submit');
        assert.dom('[data-test-submit-revision]').doesNotExist('Submit button no longer shown');
        assert.dom('[data-test-goto-previous-page]').doesNotExist('There is no turning back from this');
        assert.dom('[data-test-link="1-first-page-of-test-schema"]').doesNotExist('Other page nav no longer shown');
        assert.dom('[data-test-link="review"]').exists('The review page is your only solace');
        assert.dom('[data-test-accept-changes]').exists('You should accept your fate');
        await click('[data-test-continue-editing]');

        // go back to add new changes
        await click('[data-test-submit-continue-button]');
        assert.dom('[data-test-link="1-first-page-of-test-schema"]').exists('Users can navigate back to other pages');
        assert.dom('[data-test-submit-revision]').exists('Submit button is back');
    });

    test('pending admin approval: Read/write users', async function(this: RevisionTestContext, assert) {
        const initiatedBy = server.create('user', 'loggedIn');
        this.registration.currentUserPermissions = [Permission.Read, Permission.Write];
        const revision = server.create(
            'schema-response',
            {
                reviewsState: RevisionReviewStates.Unapproved,
                initiatedBy,
                revisionResponses: {
                    'page-one_short-text': 'the lorax',
                },
                registration: this.registration,
            },
        );

        await visit(`/registries/revisions/${revision.id}`);
        assert.equal(currentRouteName(), 'registries.edit-revision.review', 'Routed to review page');
        assert.dom('[data-test-submit-revision]').doesNotExist('Submit button not shown');
        assert.dom('[data-test-goto-previous-page]').doesNotExist('Cannot navigate to other pages on rightnav');
        assert.dom('[data-test-link="1-first-page-of-test-schema"]')
            .doesNotExist('Cannot navigate to other pages on leftnav');
        assert.dom('[data-test-link="review"]').exists('Locked in review page');
        assert.dom('[data-test-accept-changes]').doesNotExist('R+Wusers cannot accept revision');
        assert.dom('[data-test-pending-status]').containsText(
            t('registries.edit_revision.review.pending_admin_notice'),
            'R+W users notified that revision is pending admin approval',
        );
    });
});

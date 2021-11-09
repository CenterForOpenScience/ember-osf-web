import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t, TestContext} from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { click } from 'ember-osf-web/tests/helpers';

interface ComponentTestContext extends TestContext{
    registration: RegistrationModel;
}

module('Integration | Component  | update-dropdown', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ComponentTestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('update dropdown - all revisions, non-contrib', async function(this: ComponentTestContext, assert) {
        const mirageRegistration = server.create('registration', {
            id: 'cobalt',
            title: 'Outcome Reporting Testing',
            reviewsState: RegistrationReviewStates.Accepted,
            revisionState: RevisionReviewStates.Approved,
        });
        server.create('schema-response', {
            dateModified: new Date('1999-10-19T12:05:10.571Z'),
            reviewsState: RevisionReviewStates.Approved,
            registration: mirageRegistration,
        });
        server.create('schema-response', {
            dateModified: new Date('2000-10-19T12:05:10.571Z'),
            reviewsState: RevisionReviewStates.Approved,
            registration: mirageRegistration,
        });
        server.create('schema-response', {
            id: 'selected',
            dateModified: new Date('2001-10-19T12:05:10.571Z'),
            reviewsState: RevisionReviewStates.Approved,
            registration: mirageRegistration,
        });

        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`
            <Registries::UpdateDropdown @registration={{this.registration}} @selectedRevisionId='selected'/>
        `);
        assert.dom('[data-test-update-button]').containsText(t('registries.update_dropdown.latest'), 'Latest selected');
        await click('[data-test-update-button]');
        assert.dom('[data-test-revision-link]').exists({ count: 3 }, '3 revisions shown');

        assert.dom('[data-test-update-dropdown-show-more]').doesNotExist('Show more element not shown');
        assert.dom('[data-test-update-dropdown-create-new-revision]').doesNotExist('New update button not shown');
        assert.dom('[data-test-update-dropdown-update-link]')
            .doesNotExist('Link to revision in progress not shown');
    });

    test('update dropdown - one revision, admin view', async function(this: ComponentTestContext, assert) {
        const mirageRegistration = server.create('registration', {
            id: 'cobalt',
            title: 'Outcome Reporting Testing',
            reviewsState: RegistrationReviewStates.Accepted,
            revisionState: RevisionReviewStates.Approved,
        }, 'currentUserAdmin');
        server.schema.schemaResponses.first().update({
            reviewsState: RevisionReviewStates.Approved,
        });

        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`
            <Registries::UpdateDropdown @registration={{this.registration}}/>
        `);
        await click('[data-test-update-button]');
        assert.dom('[data-test-revision-link]').exists({ count: 1 }, '1 revision shown');
        assert.dom('[data-test-revision-link]')
            .containsText(t('registries.update_dropdown.updates_list_label_original'), 'Only original responses shown');

        assert.dom('[data-test-update-dropdown-show-more]').doesNotExist('Show more element not shown');
        assert.dom('[data-test-update-dropdown-create-new-revision]').exists('New update button shown');
        assert.dom('[data-test-update-dropdown-update-link]')
            .doesNotExist('Link to revision in progress not shown');
    });

    test('update dropdown - 3 revisions, one in progress', async function(this: ComponentTestContext, assert) {
        const mirageRegistration = server.create('registration', {
            id: 'cobalt',
            title: 'Outcome Reporting Testing',
            reviewsState: RegistrationReviewStates.Accepted,
            revisionState: RevisionReviewStates.RevisionInProgress,
        }, 'currentUserAdmin');
        server.create('schema-response', {
            dateModified: new Date('1999-10-19T12:05:10.571Z'),
            reviewsState: RevisionReviewStates.Approved,
            registration: mirageRegistration,
        });
        server.create('schema-response', {
            dateModified: new Date('2000-10-19T12:05:10.571Z'),
            reviewsState: RevisionReviewStates.Approved,
            registration: mirageRegistration,
        });
        server.create('schema-response', {
            dateModified: new Date('2001-10-19T12:05:10.571Z'),
            reviewsState: RevisionReviewStates.RevisionInProgress,
            registration: mirageRegistration,
        });

        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`
            <Registries::UpdateDropdown @registration={{this.registration}}/>
        `);
        await click('[data-test-update-button]');
        assert.dom('[data-test-revision-link]').exists({ count: 2 }, 'revision in progress not listed');

        assert.dom('[data-test-update-dropdown-show-more]').doesNotExist('Show more element not shown');
        assert.dom('[data-test-update-dropdown-create-new-revision]').doesNotExist('New update button not shown');
        assert.dom('[data-test-update-dropdown-update-link]')
            .containsText(t('registries.update_dropdown.continue_update'), 'Link to revision in progress shown');
    });
});

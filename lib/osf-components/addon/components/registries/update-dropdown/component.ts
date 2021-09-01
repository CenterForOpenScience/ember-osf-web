/* eslint-disable no-console */
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';

import RegistrationModel from 'ember-osf-web/models/registration';
import RevisionModel, { RevisionReviewStates } from 'ember-osf-web/models/revision';
import CurrentUserService from 'ember-osf-web/services/current-user';
import Toast from 'ember-toastr/services/toast';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import { taskFor } from 'ember-concurrency-ts';
import { computed } from '@ember/object';
import registration from 'ember-osf-web/mirage/factories/registration';

interface Args {
    registration: RegistrationModel;
}

type RevisionJustification = 'Adding Results' | 'Typo - Self' | 'Typo - Other' | 'Copy Edit';

export default class UpdateDropdown extends Component<Args> {
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;
    @service router!: RouterService;

    revisions?: QueryHasManyResult<RevisionModel>;
    isPendingCurrentUserApproval?: boolean;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getRevisionList).perform();
    }

    @computed('args.registration.{userHasAdminPermission,revisionState}')
    get shouldDisplayApproveDenyButtons() {
        return this.args.registration.userHasAdminPermission
        && this.args.registration.revisionState
        && ![
            RevisionReviewStates.RevisionInProgress,
            RevisionReviewStates.Approved,
        ].includes(this.args.registration.revisionState);
    }

    // per Nici's request
    // TODO implement it, apply inline to rvision list
    @computed('args.registration.revisionState')
    get updateNotificationIcon() {
        switch (this.args.registration.revisionState) {
        case RevisionReviewStates.Approved:
            return 'lock';
        case RevisionReviewStates.RevisionInProgress:
            return 'eye';
        case RevisionReviewStates.RevisionPendingAdminApproval:
        case RevisionReviewStates.RevisionPendingModeration:
            return 'clock';
        default:
            return '';
        }
    }

    @task
    @waitFor
    async getRevisionList() {

        if (!registration){
            throw new Error('Not a registration.');
        }
        if (this.args.registration.revisions === null || this.args.registration.revisions === undefined) {
            return {
                placeholder: this.intl.t('registries.update_dropdown.no_revisions'),
            };
        }
        if (this.args.registration.revisions) {
            console.log('In the revisions exist for getRevisionFunction');
            try {
                const revisions = await this.args.registration.queryHasMany('revisions');
                this.revisions = revisions.sort();
                return revisions;
            } catch (e) {
                const errorMessage = this.intl.t('registries.update_dropdown.error_message');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                console.log('No revisions found. Something went wrong: ', e);
            }
            if (RevisionReviewStates.RevisionPendingAdminApproval || RevisionReviewStates.RevisionPendingModeration) {
                console.log('Revision pending administrative or moderative approval.');
                // if super, display diff and have an 'Approve Results' or 'Needs more edits' button that scrolls
                // length of edit.
                // NOTE the button displays a dropdown directly below the edit's presently displayed edits
                // set & check isPendingUserApproval is 'True' after a submit

                // if initiatedBy usr, display a read-only list, change bkg color to gold and French grey out click
                // alert user that their changes are pending their further edits, bkg color for super and usr is now red

            } else if (RevisionReviewStates.RevisionInProgress) {
                console.log('Revision in progress');
                // TODO if initiatedBy usr, add translation string for usr their changes are pending their further edits
                // backgound color is red to indicate it is awaiting re-edits

                // if not the usr, make element unclickable in list and Fench greyed out with black italicized text
                // add translation string to indicate an edit by another user is in progress

            } else {
                return {
                    placeholder: this.intl.t('registries.update_dropdown.other_error'),
                };
            }
        }
    }

    @task
    @waitFor
    async needsMoreUpdates() {
        if (!this.revisions) {
            throw new Error('Not a revision.');
        }
        // add error for button unclickable
        try {
            this.args.registration.set('revisionState', RevisionReviewStates.RevisionInProgress);
        } catch (e) {
            throw new Error('...something was caught and thrown.');
        }
        return this.args.registration;
    }

    @task
    @waitFor
    async acceptUpdates() {
        if (!this.revisions) {
            throw new Error('Not a revision.');
        }
        // add error for button unclickable
        try {
            this.args.registration.set('revisionState', RevisionReviewStates.Approved);
        } catch (e) {
            throw new Error('...something was caught and thrown.');
        }
        return this.args.registration;
    }

    // loadVersionedRegistration() reloads the current view with clicked on version
    @task
    @waitFor
    async loadRegistrationVersionNumber() {
        // replace current view with clicked on version number from dropdown list
        // TODO NOTE look at differences between transistionTo() and replaceRoute()
        return this.args.registration;
    }

    // load the changes between this and previous SchemaResponse in git style diff
    @task
    @waitFor
    async loadDiff(revisionJustification: RevisionJustification) {
        // allow for potential edits in tabbed fashion to the right hand side of the diff
        // eg each potential submitted (call for all edits) revision is tabbed and displayed on side
        // if only one, no tabs or tab that says no further edits displays as submissions are accepted
        // for a particular registration, tabs scroll vertically up or down by submission daten allowing
        // for filterable edits where the user can easily tab through and make a decision by type of edit.
        console.log('The reason for a revision: ', revisionJustification);
        const diff = this.args.registration.reviewActions;
        return diff;
    }
}


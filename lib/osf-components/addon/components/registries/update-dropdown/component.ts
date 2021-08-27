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

interface Args {
    registration: RegistrationModel;
}

enum UpdateActions {
    AcceptUpdates = 'Accept Updates',
    NeedsMoreUpdates = 'Needs More Updates',
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

        console.log('In the getRevisionFunction');

        if (this.args.registration.revisions === null || this.args.registration.revisions === undefined) {
            // ASK if checking the array length would be good
            console.log('In the null case for getRevisionFunction');
            console.log('No revisions present for this registration.');
            return {
                placeholder: this.intl.t('registries.update_dropdown.no_revisions'),
            };
        }
        if (this.args.registration.revisions) {
            console.log('In the revisions present for getRevisionFunction');
            if (RevisionReviewStates.Approved) {
                console.log('In the reivison approved case for getRevisionFunction');
                console.log('Revision approved');
                try {
                    const revisions = await this.args.registration.queryHasMany('revisions');
                    this.revisions = revisions;
                    return revisions;
                } catch (e) {
                    const errorMessage = this.intl.t('registries.update_dropdown.error_message');
                    captureException(e, { errorMessage });
                    this.toast.error(getApiErrorMessage(e), errorMessage);
                    console.log('No revisions found. Something went wrong: ', e);
                }
            } else if (RevisionReviewStates.RevisionPendingAdminApproval ||
                RevisionReviewStates.RevisionPendingModeration) {
                // if waiting admin or moderation approval, associated revision list will display in list but
                // background color of element will be yellow indicating a blocked status
                // change backgroud color to yellow and grey out click
                // eslint-disable-next-line no-console
                console.log('Revision pending administrative or moderative approval.');
            } else if (RevisionReviewStates.RevisionInProgress) {
            // if in progress and that user initiated the edit or it falls in their moderation/approval
            // chain of command, the list displays but the backgound color changes to transparent red
            // to indicate that the document is currently uneditable.
                console.log('Revision in progress');

                // make element unclickable in list if not the user and greyed out with black italicized text

                // make element clickable and load revised Registration if user who made edits or in their mod chain

                // if a admin or mod, include a button to display diff of the individual edits pending review
                // this button initiates a nested dropdown for that edit.

                // at the top of the displayed diff have an approve or deny button that scrolls with its length

            } else {
                return {
                    placeholder: this.intl.t('registries.update_dropdown.other_error'),
                };
            }
        }
    }


    @task
    @waitFor
    async needsMoreUpdates(updateActions : UpdateActions) {
        if (!this.revisions) {
            throw new Error('Not a revision.');
        }

        switch(updateActions) {
        case UpdateActions.AcceptUpdates:
            this.args.registration.set('revisionState', RevisionReviewStates.Approved);
            break;
        case UpdateActions.NeedsMoreUpdates:
            this.args.registration.set('revisionState', RevisionReviewStates.RevisionInProgress);
            break;
        default:
            throw new Error('Action not permitted.');
        }
        // try {
        //     place code here
        // } catch (e) {
        //     throw new Error("...something was caught and thrown.");
        // }
    }

    @task
    @waitFor
    async acceptUpdates() {
        // try {
        //     place code here
        // } catch (e) {
        //     throw new Error("...something was caught and thrown.");
        // }
        this.args.registration.revisionState = RevisionReviewStates.Approved;
        return this.args.registration;
    }

    // loadVersionedRegistration() reloads the current view with clicked on version
    @task
    @waitFor
    async loadVersionedRegistration() {
        // replace current view with clicked on version number from dropdown list
        // TODO look at differences between transistionTo() and replaceRoute()
        return this.args.registration;
    }

    @task
    @waitFor
    async loadDiff(revisionJustification: RevisionJustification) {
        // load the changes between this and previous SchemaResponse in git style diff
        // later, allow for potential edits in tabbed fashion on right hand side of the diff
        // eg each potential submitted (call for all edits) revision is tabbed and displayed on side
        // if only one, no tabs or tab that says no further edits displays
        // as submissions are accepted for a particular registration, tabs scroll vertically up or
        // down by submission daten allowing for filterable edits where the user can easily tab through
        // and approve all critical or important changes.
        console.log(revisionJustification);
        const diff = this.args.registration.reviewActions;
        return diff;
    }
}


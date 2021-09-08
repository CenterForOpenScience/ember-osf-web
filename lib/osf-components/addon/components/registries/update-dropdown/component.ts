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
    revisionJustification?: RevisionJustification;

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
            const notRegistrationError = this.intl.t('registries.update_dropdown.not_a_registration_error');
            return this.toast.error(notRegistrationError);
        }
        if (this.args.registration.revisions === null || this.args.registration.revisions === undefined) {
            return {
                placeholder: this.intl.t('registries.update_dropdown.no_revisions_error'),
            };
        }
        if (this.args.registration.revisions) {
            try {
                const revisions = await this.args.registration.queryHasMany('revisions');
                this.revisions = revisions.sort();
                return revisions;
            } catch (e) {
                const errorMessage = this.intl.t('registries.update_dropdown.revision_error_message');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
            }
        }
    }

    @task
    @waitFor
    async needsMoreUpdates() {
        if (!this.revisions) {
            const errorMessage = this.intl.t('registries.update_dropdown.not_a_revision_error');
            return this.toast.error(errorMessage);
        }
        try {
            this.args.registration.set('revisionState', RevisionReviewStates.RevisionInProgress);
            const message = this.intl.t('registries.update_dropdown.revision_more_updates_success');
            this.toast.success(message);
        } catch (e) {
            const errorMessage = this.intl.t('registries.update_dropdown.revision_state_not_set_error');
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }
        return this.args.registration;
    }

    @task
    @waitFor
    async approveUpdates() {
        if (!this.revisions) {
            const errorMessage = this.intl.t('registries.update_dropdown.not_a_revision_error');
            return this.toast.error(errorMessage);
        }
        try {
            this.args.registration.set('revisionState', RevisionReviewStates.Approved);
            const message =  this.intl.t('registries.update_dropdown.revision_approved_success');
            this.toast.success(message);
        } catch (e) {
            const errorMessage = this.intl.t('registries.update_dropdown.revision_state_not_set_error');
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }
        return this.args.registration;
    }
}


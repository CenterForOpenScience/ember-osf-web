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
import RouterService from '@ember/routing/router-service';
import { taskFor } from 'ember-concurrency-ts';
import { tracked } from '@glimmer/tracking';

interface Args {
    registration: RegistrationModel;
}

export default class UpdateDropdown extends Component<Args> {
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service toast!: Toast;
    @service router!: RouterService;
    @tracked revisions?: QueryHasManyResult<RevisionModel> | RevisionModel[];

    isPendingCurrentUserApproval?: boolean;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getRevisionList).perform();
    }

    get shouldShowApproveDenyButtons() {
        return this.args.registration.userHasAdminPermission
        && this.args.registration.revisionState
        && ![
            RevisionReviewStates.RevisionInProgress,
            RevisionReviewStates.Approved,
        ].includes(this.args.registration.revisionState);
    }

    @task
    @waitFor
    async getRevisionList() {

        if (!this.args.registration){
            const notReistrationError = this.intl.t('registries.update_dropdown.not_a_registration_error');
            return this.toast.error(notReistrationError);
        }
        try {
            const revisions = await this.args.registration.queryHasMany('revisions');
            this.revisions = revisions.sort();
        } catch (e) {
            const errorMessage = this.intl.t('registries.update_dropdown.revision_error_message');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }
}



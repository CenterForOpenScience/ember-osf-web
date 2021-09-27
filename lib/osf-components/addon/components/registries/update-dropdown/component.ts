/* eslint-disable no-console */
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';

import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
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
    @service store!: Store;
    @service router!: RouterService;

    @tracked currentPage = 1;
    @tracked totalPage = 1;
    @tracked totalRevisions = 0;
    @tracked revisions: QueryHasManyResult<SchemaResponseModel> | SchemaResponseModel[] = [];

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

    get hasMore() {
        return this.currentPage <= this.totalPage;
    }

    get shouldShowLoadMore() {
        return !taskFor(this.getRevisionList).isRunning
            && taskFor(this.getRevisionList).lastComplete
            && this.hasMore;
    }

    @task
    @waitFor
    async getRevisionList() {

        if (!this.args.registration){
            const notReistrationError = this.intl.t('registries.update_dropdown.not_a_registration_error');
            return this.toast.error(notReistrationError);
        }
        try {
            if (this.hasMore) {
                const currentPageResult = await this.args.registration.queryHasMany('schemaResponses', {
                    page: this.currentPage,
                });
                this.totalPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
                this.totalRevisions = currentPageResult.meta.total;
                this.revisions.pushObjects(currentPageResult);
                this.currentPage += 1;
            }
            this.revisions.sort( (a, b) => b.revisionNumber - a.revisionNumber ); // TODO: remove after demo
        } catch (e) {
            const errorMessage = this.intl.t('registries.update_dropdown.revision_error_message');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @task
    @waitFor
    async createNewSchemaResponse() {
        const newRevision: SchemaResponseModel = this.store.createRecord('schema-response', {
            registration: this.args.registration,
        });
        await newRevision.save();
        this.router.transitionTo('registries.edit-revision', newRevision.id);
    }
}



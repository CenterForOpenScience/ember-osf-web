import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';

import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface Args {
    registration: RegistrationModel;
    selectedRevisionId: string;
    isModeratorMode: boolean;
}

export default class UpdateDropdown extends Component<Args> {
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service media!: Media;
    @service toast!: Toast;
    @service store!: Store;
    @service router!: RouterService;

    @tracked showModal = false;
    @tracked currentPage = 1;
    @tracked totalPage = 1;
    @tracked totalRevisions = 0;
    @tracked revisions: QueryHasManyResult<SchemaResponseModel> | SchemaResponseModel[] = [];
    @tracked latestRevision!: SchemaResponseModel;

    isPendingCurrentUserApproval?: boolean;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getRevisionList).perform();
    }

    get isDesktop(): boolean {
        return this.media.isDesktop || this.media.isJumbo;
    }

    get hasMore() {
        return this.currentPage <= this.totalPage;
    }

    get shouldShowLoadMore() {
        return !taskFor(this.getRevisionList).isRunning
            && taskFor(this.getRevisionList).lastComplete
            && this.hasMore;
    }

    get shouldShowCreateButton(): boolean {
        return Boolean(this.revisions.length) && !this.args.isModeratorMode
            && this.args.registration.userHasAdminPermission
            && [
                RegistrationReviewStates.Accepted,
                RegistrationReviewStates.Embargo,
            ].includes(this.args.registration.reviewsState!)
            && this.args.registration.revisionState === RevisionReviewStates.Approved;
    }

    get shouldShowUpdateLink(): boolean {
        return Boolean(this.revisions.length) && !this.args.isModeratorMode
            && this.args.registration.userHasReadPermission
            && [
                RegistrationReviewStates.Accepted,
                RegistrationReviewStates.Embargo,
            ].includes(this.args.registration.reviewsState!)
            && this.args.registration.revisionState !== RevisionReviewStates.Approved;
    }

    get selectedRevisionIndex(): number {
        return this.revisions.findIndex(revision => revision.id === this.args.selectedRevisionId);
    }

    @action
    showCreateModal() {
        this.showModal = true;
    }

    @action
    closeCreateModal() {
        this.showModal = false;
    }

    @action
    onRevisionSelect(callback: () => void) {
        this.router.on('routeDidChange', () => {
            callback();
        });
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
                this.totalRevisions = currentPageResult.meta.total - 1; // -1 because the first revision is 0
                this.revisions.pushObjects(currentPageResult);
                this.latestRevision = this.revisions[0];
                this.currentPage += 1;
            }
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

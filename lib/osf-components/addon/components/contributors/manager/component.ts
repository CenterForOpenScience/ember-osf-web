import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { enqueueTask } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import PreprintModel from 'ember-osf-web/models/preprint';

import { layout } from 'ember-osf-web/decorators/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import UserModel from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';
import template from './template';

@layout(template)
@tagName('')
export default class ContributorsManager extends Component {
    @service currentUser!: CurrentUser;
    @service toast!: Toast;
    @service intl!: Intl;
    @service store!: Store;
    @service router!: RouterService;

    preprint?: PreprintModel;
    node?: NodeModel;
    draftRegistration?: DraftRegistrationModel;

    @tracked contributors: ContributorModel[] = [];
    @tracked totalPage = 1;
    @tracked currentPage = 1;
    @tracked isDragging = false;

    @computed('currentPage', 'totalPage')
    get hasMore() {
        return this.currentPage <= this.totalPage;
    }

    get modelName() {
        const modelName = (this.node || this.draftRegistration || this.preprint || {}).modelName || '';
        return modelName.replace('-', ' ');
    }

    @computed('fetchContributors.isRunning', 'hasMore', 'isDragging')
    get shouldShowLoadMore() {
        return !taskFor(this.fetchContributors).isRunning
            && taskFor(this.fetchContributors).lastComplete
            && this.hasMore
            && !this.isDragging;
    }

    @enqueueTask({ on: 'init' })
    @waitFor
    async fetchContributors() {
        const model = this.node || this.draftRegistration || this.preprint;
        if (model && this.hasMore) {
            const currentPageResult = await model.queryHasMany('contributors', {
                page: this.currentPage,
            });
            this.totalPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
            this.contributors.pushObjects(currentPageResult);
            this.currentPage += 1;
        }
    }

    @enqueueTask
    @waitFor
    async toggleContributorIsBibliographic(contributor: ContributorModel) {
        contributor.toggleProperty('bibliographic');
        try {
            await contributor.save();
            this.toast.success(this.intl.t('osf-components.contributors.editIsBibliographic.success'));
        } catch (e) {
            contributor.rollbackAttributes();
            const errorMessage = this.intl.t('osf-components.contributors.editIsBibliographic.error');
            this.toast.error(errorMessage);
            captureException(e, { errorMessage });
        }
    }

    @enqueueTask
    @waitFor
    async updateContributorPermission(contributor: ContributorModel, permission: Permission) {
        // eslint-disable-next-line no-param-reassign
        contributor.permission = permission;
        try {
            await contributor.save();
            this.toast.success(this.intl.t('osf-components.contributors.editPermission.success'));
        } catch (e) {
            contributor.rollbackAttributes();
            const errorMessage = this.intl.t('osf-components.contributors.editPermission.error');
            this.toast.error(errorMessage);
            captureException(e, { errorMessage });
        }
    }

    @enqueueTask
    @waitFor
    async reorderContributor(newOrder: ContributorModel[], contributor: ContributorModel) {
        const oldOrder = this.contributors;
        const newIndex = newOrder.indexOf(contributor);
        try {
            contributor.setProperties({
                index: newIndex,
            });
            this.contributors = newOrder;
            await contributor.save();
            this.toast.success(this.intl.t('osf-components.contributors.reorderContributor.success'));
        } catch (e) {
            this.contributors = oldOrder;
            this.toast.error(getApiErrorMessage(e));
        }
    }

    @action
    removeContributor(contributor: ContributorModel) {
        taskFor(this.removeContributorTask).perform(contributor);
    }

    @enqueueTask
    @waitFor
    async removeContributorTask(contributor: ContributorModel) {
        const contributorName = contributor.unregisteredContributor
            ? contributor.unregisteredContributor
            : contributor.users.get('fullName');
        const userId = contributor.users.get('id');
        const user = this.currentUser.get('user');
        try {
            await contributor.destroyRecord();
            this.contributors.removeObject(contributor);

            if (user && user.id === userId) {
                this.toast.success(this.intl.t('contributor_list.remove_contributor.success'));
                this.router.transitionTo('home');
            } else {
                this.toast.success(this.intl.t(
                    'osf-components.contributors.removeContributor.success',
                    { contributorName, htmlSafe: true },
                ));
            }
        } catch (e) {
            const apiError = getApiErrorMessage(e);
            const errorHeading = this.intl.t('osf-components.contributors.removeContributor.errorHeading');
            this.toast.error(`${errorHeading}${apiError}`);
        }
    }

    @enqueueTask
    @waitFor
    async addContributor(user: UserModel, permission: Permission, bibliographic: boolean) {
        try {
            const newContributor = this.store.createRecord('contributor', {
                permission,
                bibliographic,
                node: this.node,
                preprint: this.preprint,
                draftRegistration: this.draftRegistration,
                users: user,
            });
            await newContributor.save();
            this.contributors.pushObject(newContributor);
            this.toast.success(this.intl.t('osf-components.contributors.addContributor.success'));
        } catch (e) {
            const apiError = getApiErrorMessage(e);
            const errorHeading = this.intl.t('osf-components.contributors.addContributor.errorHeading');
            this.toast.error(`${errorHeading}${apiError}`);
        }
    }

    @enqueueTask
    @waitFor
    async addUnregisteredContributor(email: string, fullName: string, permission: Permission, bibliographic: boolean) {
        try {
            const newContributor = this.store.createRecord('contributor', {
                permission,
                bibliographic,
                email,
                fullName,
                node: this.node,
                preprint: this.preprint,
                draftRegistration: this.draftRegistration,
            });
            await newContributor.save();
            this.contributors.pushObject(newContributor);
            this.toast.success(this.intl.t('osf-components.contributors.addContributor.success'));
        } catch (e) {
            const apiError = getApiErrorMessage(e);
            const errorHeading = this.intl.t('osf-components.contributors.addContributor.errorHeading');
            this.toast.error(`${errorHeading}${apiError}`);
        }
    }
}

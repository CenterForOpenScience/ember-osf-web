import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import UserModel from 'ember-osf-web/models/user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';
import template from './template';

const nameFields = [
    'full_name',
    'given_name',
    'middle_names',
    'family_name',
].join();

@layout(template)
@tagName('')
export default class ContributorsManager extends Component {
    @service toast!: Toast;
    @service intl!: Intl;
    @service store!: DS.Store;

    node!: NodeModel | DraftRegistrationModel;
    @tracked contributors: ContributorModel[] = [];
    @tracked totalPage: number = 1;
    @tracked currentPage: number = 1;
    @tracked totalUsersPage: number = 1;
    @tracked currentUsersPage: number = 1;
    @tracked isDragging = false;
    @tracked query: string = '';
    @tracked results: UserModel[] = [];
    @tracked addedContributors: ContributorModel[] = [];

    @computed('fetchContributors.isRunning', 'hasMore', 'isDragging')
    get shouldShowLoadMore() {
        return !this.fetchContributors.isRunning
            && this.fetchContributors.lastComplete
            && this.hasMore
            && !this.isDragging;
    }

    @computed('currentPage', 'totalPage')
    get hasMore() {
        return this.currentPage <= this.totalPage;
    }

    @computed('fetchContributors.isRunning', 'hasMore', 'isDragging')
    get shouldShowLoadMoreUsers() {
        return !this.fetchUsers.isRunning
            && this.fetchUsers.lastComplete
            && this.hasMoreUsers
            && !this.isDragging;
    }

    @computed('currentPage', 'totalPage')
    get hasMoreUsers() {
        return this.currentUsersPage <= this.totalUsersPage;
    }

    @task({ withTestWaiter: true, on: 'init', enqueue: true })
    fetchContributors = task(function *(this: ContributorsManager) {
        if (this.node && this.hasMore) {
            const currentPageResult = yield this.node.queryHasMany('contributors', {
                page: this.currentPage,
            });
            this.totalPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
            this.contributors.pushObjects(currentPageResult);
            this.currentPage += 1;
        }
    });

    @task({ withTestWaiter: true, enqueue: true })
    fetchUsers = task(function *(this: ContributorsManager) {
        const currentPageResult = yield this.store.query('user', {
            filter: {
                [nameFields]: this.query,
            },
            page: this.currentUsersPage,
        });
        this.results = currentPageResult.toArray();
        this.totalUsersPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
        this.currentUsersPage += 1;
    });

    @task({ withTestWaiter: true, enqueue: true })
    toggleContributorIsBibliographic = task(function *(this: ContributorsManager, autoSave: boolean, contributor: ContributorModel) {
        contributor.toggleProperty('bibliographic');
        if (autoSave) {
            try {
                yield contributor.save();
                this.toast.success(this.intl.t('osf-components.contributors.editIsBibliographic.success'));
            } catch (e) {
                contributor.rollbackAttributes();
                const errorMessage = this.intl.t('osf-components.contributors.editIsBibliographic.error');
                this.toast.error(errorMessage);
                captureException(e, { errorMessage });
            }
        }
    });

    @task({ withTestWaiter: true, enqueue: true })
    updateContributorPermission = task(
        function *(this: ContributorsManager, autoSave: boolean, contributor: ContributorModel, permission: Permission) {
            // eslint-disable-next-line no-param-reassign
            contributor.permission = permission;
            if (autoSave) {
                try {
                    yield contributor.save();
                    this.toast.success(this.intl.t('osf-components.contributors.editPermission.success'));
                } catch (e) {
                    contributor.rollbackAttributes();
                    const errorMessage = this.intl.t('osf-components.contributors.editPermission.error');
                    this.toast.error(errorMessage);
                    captureException(e, { errorMessage });
                }
            }
        },
    );

    @task({ withTestWaiter: true, enqueue: true })
    reorderContributor = task(
        function *(this: ContributorsManager, newOrder: ContributorModel[], contributor: ContributorModel) {
            const oldOrder = this.contributors;
            const newIndex = newOrder.indexOf(contributor);
            try {
                contributor.setProperties({
                    index: newIndex,
                });
                this.contributors = newOrder;
                yield contributor.save();
                this.toast.success(this.intl.t('osf-components.contributors.reorderContributor.success'));
            } catch (e) {
                this.contributors = oldOrder;
                this.toast.error(getApiErrorMessage(e));
            }
        },
    );

    @task({ withTestWaiter: true, enqueue: true })
    removeContributor = task(
        function *(this: ContributorsManager, contributor: ContributorModel) {
            try {
                yield contributor.destroyRecord();
                this.contributors.removeObject(contributor);
                const contributorName = contributor.unregisteredContributor
                    ? contributor.unregisteredContributor
                    : contributor.users.get('fullName');
                this.toast.success(this.intl.t(
                    'osf-components.contributors.removeContributor.success',
                    { contributorName, htmlSafe: true },
                ));
            } catch (e) {
                const apiError = getApiErrorMessage(e);
                const errorHeading = this.intl.t('osf-components.contributors.removeContributor.errorHeading');
                this.toast.error(`${errorHeading}${apiError}`);
            }
        },
    );

    @action
    addUser(user: UserModel) {
        const newContributor = this.store.createRecord('contributor', {
            permission: 'write',
            bibliographic: true,
            sendEmail: 'false',
            nodeId: this.node.id,
            userId: user.id,
            users: user,
        });
        this.addedContributors.pushObject(newContributor);
    }
}

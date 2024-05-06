import Store from '@ember-data/store';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import UserModel from 'ember-osf-web/models/user';
import ContributorsManager from 'osf-components/components/contributors/manager/component';

interface UserSearchComponentArgs {
    manager: ContributorsManager;
}

const nameFields = [
    'full_name',
    'given_name',
    'middle_names',
    'family_name',
].join();

export default class UserSearchComponent extends Component<UserSearchComponentArgs> {
    @service store!: Store;

    @tracked query = '';
    @tracked results: UserModel[] = [];
    @tracked totalUsersPage = 1;
    @tracked currentUsersPage = 1;
    @tracked displayResults = false;

    @computed('fetchUsers.isRunning', 'hasMoreUsers')
    get shouldShowLoadMoreUsers() {
        return !taskFor(this.fetchUsers).isRunning
            && taskFor(this.fetchUsers).lastComplete
            && this.hasMoreUsers;
    }

    get hasMoreUsers() {
        return this.currentUsersPage < this.totalUsersPage;
    }

    @action
    public cancelSearch(): void {
        this.query = '';
        this.displayResults = false;
    }

    @keepLatestTask
    @waitFor
    async fetchUsers(isFetchingNextPage: boolean) {
        if (isFetchingNextPage) {
            this.currentUsersPage += 1;
        } else {
            await timeout(500);
            this.currentUsersPage = 1;
            this.results = [];
        }
        const currentPageResult = await this.store.query('user', {
            filter: {
                [nameFields]: this.query,
            },
            page: this.currentUsersPage,
        });
        this.displayResults = true;
        this.results = this.results.concat(currentPageResult.toArray());
        this.totalUsersPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
    }
}

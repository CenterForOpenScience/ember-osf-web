import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
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
    @service store!: DS.Store;

    @tracked query: string = '';
    @tracked results: UserModel[] = [];
    @tracked totalUsersPage: number = 1;
    @tracked currentUsersPage: number = 1;

    @computed('fetchUsers.isRunning', 'hasMoreUsers')
    get shouldShowLoadMoreUsers() {
        return !this.fetchUsers.isRunning
            && this.fetchUsers.lastComplete
            && this.hasMoreUsers;
    }

    get hasMoreUsers() {
        return this.currentUsersPage < this.totalUsersPage;
    }

    @task({ withTestWaiter: true, keepLatest: true })
    fetchUsers = task(function *(this: UserSearchComponent, isFetchingNextPage: boolean) {
        if (isFetchingNextPage) {
            this.currentUsersPage += 1;
        } else {
            yield timeout(500);
            this.currentUsersPage = 1;
            this.results = [];
        }
        const currentPageResult = yield this.store.query('user', {
            filter: {
                [nameFields]: this.query,
            },
            page: this.currentUsersPage,
        });
        this.results = this.results.concat(currentPageResult.toArray());
        this.totalUsersPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
    });
}

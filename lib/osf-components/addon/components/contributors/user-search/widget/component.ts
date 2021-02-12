import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { enqueueTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';
import { PaginatedMeta } from 'osf-api';

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
        const fetchUsersTask = taskFor(this.fetchUsers);
        return !fetchUsersTask.isRunning
            && fetchUsersTask.lastComplete
            && this.hasMoreUsers;
    }

    get hasMoreUsers() {
        return this.currentUsersPage <= this.totalUsersPage;
    }

    @enqueueTask({ withTestWaiter: true })
    async fetchUsers() {
        const currentPageResult = await this.store.query('user', {
            filter: {
                [nameFields]: this.query,
            },
            page: this.currentUsersPage,
        }) as ArrayProxy<UserModel> & { meta: PaginatedMeta };
        this.results = currentPageResult.toArray();
        this.totalUsersPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
        this.currentUsersPage += 1;
    }
}

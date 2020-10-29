import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { timeout } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';

export default class MeetingsList extends Component {
    // Private properties
    search?: string;
    sort = '-submissions_count';

    @computed('search', 'sort')
    get query() {
        const query = {} as Record<string, string>;
        if (this.search) {
            query['filter[name]'] = this.search;
        }
        if (this.sort) {
            query.sort = this.sort;
        }
        return query;
    }

    @restartableTask({ withTestWaiter: true })
    async searchMeetings(search: string) {
        await timeout(500); // debounce
        this.set('search', search);
    }

    @action
    sortMeetings(sort: string) {
        this.set('sort', sort);
    }
}

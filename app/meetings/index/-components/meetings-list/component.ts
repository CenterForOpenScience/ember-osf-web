import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default class MeetingsList extends Component.extend({
    searchMeetings: task(function *(this: MeetingsList, search: string) {
        yield timeout(500); // debounce
        this.set('search', search);
    }).restartable(),
}) {
    // Private properties
    search?: string;
    sort?: string;

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

    @action
    sortMeetings(sort: string) {
        this.set('sort', sort);
    }
}

import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import MeetingSubmissionModel from 'ember-osf-web/models/meeting-submission';

@tagName('')
export default class MeetingSubmissionsList extends Component.extend({
    searchSubmissions: task(function *(this: MeetingSubmissionsList, search: string) {
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
            query['filter[title,author_name,meeting_category]'] = this.search;
        }
        if (this.sort) {
            query.sort = this.sort;
        }
        return query;
    }

    @action
    sortSubmissions(sort: string) {
        this.set('sort', sort);
    }

    @action
    downloadFile(submission: MeetingSubmissionModel) {
        window.open(submission.links.download);
    }
}

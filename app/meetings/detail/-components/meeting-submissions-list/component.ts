import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import MeetingSubmissionModel from 'ember-osf-web/models/meeting-submission';

@tagName('')
export default class MeetingSubmissionsList extends Component {
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

    @task({ restartable: true })
    searchSubmissions = task(function *(this: MeetingSubmissionsList, search: string) {
        yield timeout(500); // debounce
        this.set('search', search);
    });

    @action
    sortSubmissions(sort: string) {
        this.set('sort', sort);
    }

    @action
    downloadFile(submission: MeetingSubmissionModel) {
        window.open(submission.links.download);
    }
}

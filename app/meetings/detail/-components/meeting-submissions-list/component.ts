import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import Media from 'ember-responsive';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';

import MeetingSubmissionModel from 'ember-osf-web/models/meeting-submission';

@tagName('')
export default class MeetingSubmissionsList extends Component {
    @service media!: Media;
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

    @restartableTask
    @waitFor
    async searchSubmissions(search: string) {
        await timeout(500); // debounce
        this.set('search', search);
    }

    @action
    sortSubmissions(sort: string) {
        this.set('sort', sort);
    }

    @action
    downloadFile(submission: MeetingSubmissionModel) {
        window.open(submission.links.download);
    }

    get isMobile() {
        return this.media.isMobile;
    }
}

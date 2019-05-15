import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Analytics from 'ember-osf-web/services/analytics';
import { task } from 'ember-concurrency';


export default class MeetingsDetail extends Route {
    @service analytics!: Analytics;

    getSubmissions = task(function* (this: MeetingsDetail, meetingId: string) {
        return yield this.store.query('meeting-submissions', { meetingId , page: 1 })
    });

    model(this: MeetingsDetail, params: { meeting_id: string }) {
        return {
            meetingId: params.meeting_id,
            taskInstance: this.get('getSubmissions').perform(params.meeting_id),
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
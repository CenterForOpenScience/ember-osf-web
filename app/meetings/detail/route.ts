import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import { task } from 'ember-concurrency';
import Analytics from 'ember-osf-web/services/analytics';

export default class MeetingsDetail extends Route {
    @service analytics!: Analytics;
    @service router!: any;

    loadMeetingDetail = task(function *(this: MeetingsDetail, meetingId: string) {
        try {
            const meeting = yield this.store.findRecord('meeting', meetingId);
            return meeting;
        } catch (error) {
            this.transitionTo('not-found', this.get('router').get('currentURL').slice(1));
            return undefined;
        }
    });

    model(this: MeetingsDetail, params: Record<string, string>) {
        return {
            taskInstance: this.get('loadMeetingDetail').perform(params.meeting_id),
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}

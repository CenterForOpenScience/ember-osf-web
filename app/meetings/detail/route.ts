import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import Analytics from 'ember-osf-web/services/analytics';

export default class MeetingsDetail extends Route {
    @service analytics!: Analytics;
    @service router!: any;

    @task
    async loadMeetingDetail(meetingId: string) {
        try {
            const meeting = await this.store.findRecord('meeting', meetingId);
            return meeting;
        } catch (error) {
            this.transitionTo('not-found', this.get('router').get('currentURL').slice(1));
            return undefined;
        }
    }

    model(params: Record<string, string>) {
        return {
            taskInstance: taskFor(this.loadMeetingDetail).perform(params.meeting_id),
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}

import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

export default class MeetingsDetail extends Route {
    @service router!: RouterService;
    @service store!: Store;

    @task
    @waitFor
    async loadMeetingDetail(meetingId: string) {
        try {
            const meeting = await this.store.findRecord('meeting', meetingId);
            return meeting;
        } catch (error) {
            this.transitionTo('not-found', this.router.get('currentURL').slice(1));
            return undefined;
        }
    }

    model(params: Record<string, string>) {
        return {
            taskInstance: taskFor(this.loadMeetingDetail).perform(params.meeting_id),
        };
    }
}

import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Analytics from 'ember-osf-web/services/analytics';

export default class MeetingsDetail extends Route {
    @service analytics!: Analytics;

    model(params: Record<string, string>) {
        return params.meeting_id;
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}

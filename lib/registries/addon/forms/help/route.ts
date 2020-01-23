import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

export default class FormsHelpRoute extends Route {
    @service analytics!: Analytics;

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}

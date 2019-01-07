import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';

export default class GuidRegistrationForks extends Route {
    @service analytics!: Analytics;
    @service ready!: Ready;

    model(this: GuidRegistrationForks) {
        return this.modelFor('guid-registration');
    }

    @action
    async didTransition() {
        const { taskInstance } = this.controller.model as GuidRouteModel<Registration>;
        await taskInstance;
        const registration = taskInstance.value;
        this.analytics.trackPage(registration ? registration.public : undefined, 'registrations');
    }
}

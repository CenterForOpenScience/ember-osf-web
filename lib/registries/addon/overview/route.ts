import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import Registration from 'ember-osf-web/models/registration';
import GuidRoute, { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';

export default class Overview extends GuidRoute {
    @service analytics!: Analytics;

    modelName(): 'registration' {
        return 'registration';
    }

    include() {
        return ['registration_schema'];
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,linked_nodes,linked_registrations,children',
            },
        };
    }

    @action
    async didTransition() {
        const { taskInstance } = this.controller.model as GuidRouteModel<Registration>;
        await taskInstance;
        const registration = taskInstance.value;
        this.analytics.trackPage(registration ? registration.public : undefined, 'registrations');
    }
}

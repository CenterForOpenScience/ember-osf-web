import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Ready from 'ember-osf-web/services/ready';

export default class GuidRegistrationForks extends Route {
    @service ready!: Ready;

    model() {
        return this.modelFor('guid-registration');
    }
}

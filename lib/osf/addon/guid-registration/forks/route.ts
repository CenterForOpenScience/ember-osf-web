import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Ready from 'ember-osf-web/services/ready';

export default class GuidRegistrationForks extends Route {
    @service ready!: Ready;

    model(this: GuidRegistrationForks) {
        return this.modelFor('guid-registration');
    }
}

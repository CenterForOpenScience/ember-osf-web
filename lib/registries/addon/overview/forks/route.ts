import Route from '@ember/routing/route';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';

export default class ForksPage extends Route {
    beforeModel() {
        const model = this.modelFor('overview') as GuidRouteModel<Registration>;
        this.transitionToExternal('guid-registration.forks', model.guid);
    }
}

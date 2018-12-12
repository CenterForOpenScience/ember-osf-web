import { alias } from '@ember-decorators/object/computed';
import Controller from '@ember/controller';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';

export default class Overview extends Controller {
    model!: GuidRouteModel<Registration>;

    @alias('model.taskInstance.value')
    registration?: Registration;
}

import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';

export default class Overview extends Controller {
    model!: GuidRouteModel<Registration>;

    @alias('model.taskInstance.value')
    registration?: Registration;

    @computed('registration.{root,isRoot}')
    get root() {
        if (!this.registration || this.registration.isRoot) {
            return undefined;
        }

        return this.registration.belongsTo('root').value() as Registration;
    }
}

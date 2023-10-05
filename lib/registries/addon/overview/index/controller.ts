import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import OverviewController from '../controller';

export default class Overview extends Controller {
    model!: GuidRouteModel<Registration>;
    @controller overview!: OverviewController;

    @alias('model.taskInstance.value')
    registration?: Registration;

    @computed('registration.{root,isRoot}')
    get rootTitle() {
        if (!this.registration || this.registration.isRoot) {
            return undefined;
        }
        const rootTitle = this.registration.root.get('title');
        return rootTitle;
    }

    @computed('registration.{root,isRoot}')
    get rootId() {
        if (!this.registration || this.registration.isRoot) {
            return undefined;
        }
        const rootId = this.registration.root.get('id');
        return rootId;
    }
}

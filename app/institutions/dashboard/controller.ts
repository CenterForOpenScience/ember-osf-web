import { alias } from '@ember-decorators/object/computed';

import Controller from '@ember/controller';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionsDashboardController extends Controller {
    @alias('model.taskInstance.value') institution!: InstitutionModel;
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}

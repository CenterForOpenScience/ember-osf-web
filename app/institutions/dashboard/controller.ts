import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import moment from 'moment';

import Controller from '@ember/controller';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionsDashboardController extends Controller {
    @alias('model.taskInstance.value') institution!: InstitutionModel;

    @computed('institution.lastUpdated')
    get lastUpdatedFromNow(): string {
        const lastUpdated = this.institution ? moment(this.institution.lastUpdated) : moment();
        return lastUpdated.fromNow();
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}

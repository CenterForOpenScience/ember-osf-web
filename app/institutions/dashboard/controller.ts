import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';

import Controller from '@ember/controller';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionsDashboardController extends Controller {
    @alias('model.taskInstance.value') institution!: InstitutionModel;
    csvImgSrc: string = '/assets/images/institutions/csv.svg';

    @computed('institution.lastUpdated')
    get lastUpdatedFromNow(): string {
        const lastUpdated = this.institution ? moment(this.institution.lastUpdated) : moment();
        return lastUpdated.fromNow();
    }

    @computed('institution.links.csv')
    get csvHref() {
        return this.institution ? this.institution.links.csv : '#';
    }

    @action
    onCsvButtonMouseEnter() {
        this.set('csvImgSrc', '/assets/images/institutions/csv-hover.svg');
    }

    @action
    onCsvButtonMouseLeave() {
        this.set('csvImgSrc', '/assets/images/institutions/csv.svg');
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}

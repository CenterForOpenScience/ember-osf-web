import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
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

    @action
    onCsvButtonMouseEnter() {
        this.set('csvImgSrc', '/assets/images/institutions/csv-hover.svg');
    }

    @action
    onCsvButtonMouseLeave() {
        this.set('csvImgSrc', '/assets/images/institutions/csv.svg');
    }

    @action
    downloadCsv() {
        window.open(this.institution.links.csv);
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}

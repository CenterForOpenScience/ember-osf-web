import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';

import Controller from '@ember/controller';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionsDashboardController extends Controller {
    @alias('model.taskInstance.value') institution!: InstitutionModel;

    // eslint-disable-next-line ember/use-brace-expansion
    @computed('institution.statSummary.numPrivateProjects', 'institution.statSummary.numPublicProjects')
    get numProjects() {
        if (this.institution) {
            return this.institution.statSummary.numPrivateProjects + this.institution.statSummary.numPublicProjects;
        }
        return 0;
    }

    // eslint-disable-next-line ember/use-brace-expansion
    @computed('institution.statSummary.numPrivateProjects', 'institution.statSummary.numPublicProjects')
    get projectData() {
        if (this.institution) {
            return {
                labels: ['Public', 'Private'],
                datasets: [{
                    data: [
                        this.institution.statSummary.numPublicProjects,
                        this.institution.statSummary.numPrivateProjects,
                    ],
                    backgroundColor: [
                        '#36b183',
                        '#a5b3bd',
                    ],
                }],
            };
        }
        return {};
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}

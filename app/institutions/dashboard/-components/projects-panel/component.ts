import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class ProjectsPanel extends Component {
    institution!: InstitutionModel;

    chartOptions = {
        aspectRatio: 1,
        legend: {
            display: false,
        },
    };

    @computed('institution.statSummary.{numPrivateProjects,numPublicProjects}')
    get numProjects() {
        if (!this.institution) {
            return 0;
        }
        return this.institution.statSummary.numPrivateProjects + this.institution.statSummary.numPublicProjects;
    }

    @computed('institution.statSummary.{numPrivateProjects,numPublicProjects}')
    get chartData() {
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
}

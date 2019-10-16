import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class ProjectsPanel extends Component {
    institution!: InstitutionModel;

    chartOptions = {
        legend: {
            display: false,
        },
    };

    @computed('institution.statSummary.departments')
    get chartData() {
        if (!this.institution) {
            return {};
        }
        const departmentNames = this.institution.statSummary.departments.map(x => x.name);
        const departmentNumbers = this.institution.statSummary.departments.map(x => x.numUsers);
        return {
            labels: departmentNames,
            datasets: [{
                data: departmentNumbers,
                backgroundColor: '#a5b3bd',
                hoverBackgroundColor: '#15a5eb',
            }],
        };
    }
}

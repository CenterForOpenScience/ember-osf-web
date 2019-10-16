import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class ProjectsPanel extends Component {
    institution!: InstitutionModel;
    chartHoverIndex: number = -1;

    chartOptions = {
        aspectRatio: 1,
        legend: {
            display: false,
        },
        // tslint:disable-next-line:variable-name
        onHover: (_e: MouseEvent, shape: any) => {
            if (shape.length === 0 || this.chartHoverIndex === shape[0]._index) {
                return;
            }
            this.set('chartHoverIndex', shape[0]._index);
        },
    };

    didReceiveAttrs() {
        const departmentNumbers = this.institution.statSummary.departments.map(x => x.numUsers);
        this.chartHoverIndex = departmentNumbers.indexOf(Math.max(...departmentNumbers));
    }

    @computed('chartHoverIndex', 'institution.statSummary.departments')
    get chartData() {
        const departmentNames = this.institution.statSummary.departments.map(x => x.name);
        const departmentNumbers = this.institution.statSummary.departments.map(x => x.numUsers);

        const backgroundColors = [];
        for (const index of departmentNumbers.keys()) {
            if (index === this.chartHoverIndex) {
                backgroundColors.push('#15a5eb');
            } else {
                backgroundColors.push('#a5b3bd');
            }
        }

        return {
            labels: departmentNames,
            datasets: [{
                data: departmentNumbers,
                backgroundColor: backgroundColors,
            }],
        };
    }

    @computed('chartHoverIndex', 'institution.statSummary.departments')
    get activeDepartment() {
        return this.institution.statSummary.departments[this.chartHoverIndex];
    }

    @computed('activeDepartment', 'institution.statSummary.departments')
    get activeDepartmentPercentage() {
        // eslint-disable-next-line max-len
        const count = this.institution.statSummary.departments.reduce((total, currentValue) => total + currentValue.numUsers, 0);
        return ((this.activeDepartment.numUsers / count) * 100).toFixed(2);
    }
}

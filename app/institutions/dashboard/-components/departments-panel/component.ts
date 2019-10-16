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
        onHover: this.onChartHover,
    };

    chartHoverIndex: number = -1;

    @computed('chartHoverIndex', 'institution.statSummary.departments')
    get chartData() {
        const departmentNames = this.institution.statSummary.departments.map(x => x.name);
        const departmentNumbers = this.institution.statSummary.departments.map(x => x.numUsers);

        // If no active department, set it to the one with the most users
        if (this.chartHoverIndex === -1) {
            this.chartHoverIndex = departmentNumbers.indexOf(Math.max(...departmentNumbers));
        }

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
        if (this.chartHoverIndex > -1) {
            return this.institution.statSummary.departments[this.chartHoverIndex];
        }
        return {};
    }

    // tslint:disable-next-line:variable-name
    onChartHover(_e: MouseEvent, shape: any) {
        if (shape.length === 0 || this.chartHoverIndex === shape[0]._index) {
            return;
        }
        this.chartHoverIndex = shape[0]._index;
    }
}

import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { ChartData, ChartOptions, Shape } from 'ember-cli-chart';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class DepartmentsPanel extends Component {
    institution!: InstitutionModel;
    @alias('institution.statSummary.departments') departments!: any[];
    chartHoverIndex: number = -1;

    chartOptions: ChartOptions = {
        aspectRatio: 1,
        legend: {
            display: false,
        },
        onHover: (_: MouseEvent, shapes: Shape[]): void => {
            if (shapes.length === 0 || this.chartHoverIndex === shapes[0]._index) {
                return;
            }
            this.set('chartHoverIndex', shapes[0]._index);
        },
    };

    didReceiveAttrs() {
        const departmentNumbers = this.departments.map(x => x.numUsers);
        this.chartHoverIndex = departmentNumbers.indexOf(Math.max(...departmentNumbers));
    }

    @computed('chartHoverIndex', 'departments')
    get chartData(): ChartData {
        const departmentNames = this.departments.map(x => x.name);
        const departmentNumbers = this.departments.map(x => x.numUsers);

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

    @computed('chartHoverIndex', 'departments')
    get activeDepartment() {
        return this.departments[this.chartHoverIndex];
    }

    @computed('activeDepartment', 'departments')
    get activeDepartmentPercentage() {
        const count = this.departments.reduce((total, currentValue) => total + currentValue.numUsers, 0);
        return ((this.activeDepartment.numUsers / count) * 100).toFixed(2);
    }
}

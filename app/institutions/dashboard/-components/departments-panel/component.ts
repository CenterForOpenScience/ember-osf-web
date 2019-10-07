import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { ChartData, ChartOptions, Shape } from 'ember-cli-chart';
import InstitutionModel, { Department } from 'ember-osf-web/models/institution';

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
        if (this.departments) {
            const departmentNumbers = this.departments.map(x => x.numUsers);
            this.set('chartHoverIndex', departmentNumbers.indexOf(Math.max(...departmentNumbers)));
        }
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
    get activeDepartment(): Department {
        return this.departments[this.chartHoverIndex];
    }

    @computed('activeDepartment', 'departments')
    get activeDepartmentPercentage(): string {
        const count = this.departments.reduce((total, currentValue) => total + currentValue.numUsers, 0);
        return ((this.activeDepartment.numUsers / count) * 100).toFixed(2);
    }
}

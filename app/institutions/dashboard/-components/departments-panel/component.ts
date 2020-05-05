import Component from '@ember/component';
import { computed } from '@ember/object';
import { ChartData, ChartOptions, Shape } from 'ember-cli-chart';
import InstitutionDepartmentsModel from 'ember-osf-web/models/institution-department';

export default class DepartmentsPanel extends Component {
    departments!: InstitutionDepartmentsModel[];

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
            const departmentNumbers = this.departments.map(x => x.numberOfUsers);
            this.set('chartHoverIndex', departmentNumbers.indexOf(Math.max(...departmentNumbers)));
        }
    }

    @computed('chartHoverIndex', 'departments')
    get chartData(): ChartData {
        const departmentNames = this.departments.map(x => x.name);
        const departmentNumbers = this.departments.map(x => x.numberOfUsers);

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
    get activeDepartment(): InstitutionDepartmentsModel {
        return this.departments[this.chartHoverIndex];
    }

    @computed('activeDepartment', 'departments')
    get activeDepartmentPercentage(): string {
        const count = this.departments.reduce((total, currentValue) => total + currentValue.numberOfUsers, 0);
        return ((this.activeDepartment.numberOfUsers / count) * 100).toFixed(2);
    }
}

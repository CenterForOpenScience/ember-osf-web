import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { ChartData, ChartOptions, Shape } from 'ember-cli-chart';
import Intl from 'ember-intl/services/intl';
import { Department } from 'ember-osf-web/models/institution';
import InstitutionDepartmentsModel from 'ember-osf-web/models/institution-department';

export default class DepartmentsPanel extends Component {
    @service intl!: Intl;

    topDepartments!: InstitutionDepartmentsModel[];
    totalUsers!: number;

    chartHoverIndex: number = 0;

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

    @computed('chartHoverIndex', 'topDepartments')
    get chartData(): ChartData {
        const departmentNames = this.topDepartments.map(x => x.name);
        const departmentNumbers = this.topDepartments.map(x => x.numberOfUsers);
        const otherDepartmentNumber = this.totalUsers - departmentNumbers.reduce((a, b) => a + b);

        const displayDepartmentNames = [...departmentNames, this.intl.t('general.other')];
        const displayDepartmentNumbers = [...departmentNumbers, otherDepartmentNumber];
        const backgroundColors = [];
        for (const index of departmentNumbers.keys()) {
            if (index === this.chartHoverIndex) {
                backgroundColors.push('#15a5eb');
            } else {
                backgroundColors.push('#a5b3bd');
            }
        }

        return {
            labels: displayDepartmentNames,
            datasets: [{
                data: displayDepartmentNumbers,
                backgroundColor: backgroundColors,
            }],
        };
    }

    @computed('chartHoverIndex', 'topDepartments')
    get activeDepartment(): Department {
        return this.topDepartments.toArray()[this.chartHoverIndex];
    }

    @computed('activeDepartment', 'topDepartments')
    get activeDepartmentPercentage(): string {
        const count = this.topDepartments.reduce((total, currentValue) => total + currentValue.numberOfUsers, 0);
        return ((this.activeDepartment.numberOfUsers / count) * 100).toFixed(2);
    }
}

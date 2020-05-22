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

    @computed('topDepartments')
    get displayDepartments() {
        const departments = this.topDepartments.map(({ name, numberOfUsers }) => ({ name, numberOfUsers }));
        const departmentNumbers = this.topDepartments.map(x => x.numberOfUsers);
        const otherDepartmentNumber = this.totalUsers - departmentNumbers.reduce((a, b) => a + b);

        return [...departments, { name: this.intl.t('general.other'), numberOfUsers: otherDepartmentNumber }];
    }

    @computed('chartHoverIndex', 'displayDepartments')
    get chartData(): ChartData {
        const backgroundColors = this.displayDepartments.map((_, i) => {
            if (i === this.chartHoverIndex) {
                return '#15a5eb';
            }
            return '#a5b3bd';
        });
        const displayDepartmentNames = this.displayDepartments.map(({ name }) => name);
        const displayDepartmentNumbers = this.displayDepartments.map(({ numberOfUsers }) => numberOfUsers);

        return {
            labels: displayDepartmentNames,
            datasets: [{
                data: displayDepartmentNumbers,
                backgroundColor: backgroundColors,
            }],
        };
    }

    @computed('chartHoverIndex', 'displayDepartments')
    get activeDepartment(): Department {
        return this.displayDepartments[this.chartHoverIndex];
    }

    @computed('activeDepartment', 'displayDepartments')
    get activeDepartmentPercentage(): string {
        const numUsersArray = this.displayDepartments.map(({ numberOfUsers }) => numberOfUsers);
        const count = numUsersArray.reduce((a, b) => a + b);
        return ((this.activeDepartment.numberOfUsers / count) * 100).toFixed(2);
    }
}
